import { RouterContext } from "oak/router";
import Question from "../../models/Question.ts";
import Game from "../../models/Game.ts";
import Category from "../../models/Category.ts";

export const getGames = async (ctx: RouterContext<"/games">) => {
    try {
        const games = await Game.find();
        ctx.response.status = 200;
        ctx.response.body = games;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to get games' };
    }
}

export const createGame = async (ctx: RouterContext<"/games">) => {
    try {
        const body = await ctx.request.body.json();
        
        // Get all categories with their questions
        const categories = await Category.find().populate('questions');
        console.log('Found categories:', categories.length);
        
        // Select one question per point value (1-10) per category from unanswered questions
        const selectedQuestions = [];
        
        for (const category of categories) {
            console.log(`Category ${category.name} has ${category.questions.length} questions`);
            for (let pointValue = 1; pointValue <= 10; pointValue++) {
                // Get questions for this category and point value that haven't been used in any game
                const availableQuestions = category.questions.filter((q: any) => 
                    q.points === pointValue && !q.game
                );
                
                console.log(`Point ${pointValue}: ${availableQuestions.length} available questions`);
                
                if (availableQuestions.length > 0) {
                    // Randomly select one question
                    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                    const selectedQuestion = availableQuestions[randomIndex];
                    
                    selectedQuestions.push({
                        categoryId: category._id,
                        pointValue: pointValue,
                        questionId: selectedQuestion._id
                    });
                }
            }
        }
        
        console.log('Total selected questions:', selectedQuestions.length);
        
        // Create the game with selected questions
        const gameData = {
            ...body,
            selectedQuestions: selectedQuestions
        };
        
        const game = await Game.create(gameData);
        
        // Mark selected questions as used in this game
        const questionIds = selectedQuestions.map(sq => sq.questionId);
        await Question.updateMany(
            { _id: { $in: questionIds } },
            { game: game._id }
        );
        
        ctx.response.status = 201;
        ctx.response.body = game;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to create game' };
    }
}

export const updateGame = async (ctx: RouterContext<"/games/:id">) => {
    try {
        const { id } = ctx.params;
        const body = await ctx.request.body.json();
        const game = await Game.findByIdAndUpdate(id, body, { new: true });
        ctx.response.status = 200;
        ctx.response.body = game;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to update game' };
    }
}

export const getGame = async (ctx: RouterContext<"/games/:id">) => {
    try {
        const { id } = ctx.params;
        const game = await Game.findById(id).populate({
            path: 'selectedQuestions.questionId',
            model: 'Question'
        });
        ctx.response.status = 200;
        ctx.response.body = game;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to get game' };
    }
}

export const endGame = async (ctx: RouterContext<"/games/:id/end">) => {
    try {
        const { id } = ctx.params;
        const game = await Game.findById(id);
        
        if (!game) {
            ctx.response.status = 404;
            ctx.response.body = { error: 'Game not found' };
            return;
        }

        // Determine winner
        let winner = null;
        if (game.firstTeamScore > game.secondTeamScore) {
            winner = game.firstTeamName;
        } else if (game.secondTeamScore > game.firstTeamScore) {
            winner = game.secondTeamName;
        } else {
            winner = 'تعادل';
        }
        
        // Get all questions that were selected for this game
        const selectedQuestionIds = game.selectedQuestions.map(sq => sq.questionId);
        
        // Get answered question IDs from the game
        const answeredQuestionIds = game.answeredQuestions.map(aq => aq.questionId);
        
        // Find unanswered questions (selected but not answered)
        const unansweredQuestionIds = selectedQuestionIds.filter(qId => 
            !answeredQuestionIds.includes(qId)
        );
        
        // Remove gameId from unanswered questions
        if (unansweredQuestionIds.length > 0) {
            await Question.updateMany(
                { _id: { $in: unansweredQuestionIds } },
                { game: null }
            );
        }

        // Update game status
        const updatedGame = await Game.findByIdAndUpdate(
            id, 
            { 
                status: 'completed', 
                winner: winner 
            }, 
            { new: true }
        );

        ctx.response.status = 200;
        ctx.response.body = updatedGame;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to end game' };
    }
}

export const deleteGame = async (ctx: RouterContext<"/games/:id">) => {
    try {
        const { id } = ctx.params;
        const game = await Game.findById(id);
        
        if (!game) {
            ctx.response.status = 404;
            ctx.response.body = { error: 'Game not found' };
            return;
        }

        // Get all questions that were selected for this game
        const selectedQuestionIds = game.selectedQuestions.map(sq => sq.questionId);
        
        // Remove gameId from ALL questions (both answered and unanswered)
        if (selectedQuestionIds.length > 0) {
            await Question.updateMany(
                { _id: { $in: selectedQuestionIds } },
                { game: null }
            );
        }

        // Delete the game
        await Game.findByIdAndDelete(id);

        ctx.response.status = 200;
        ctx.response.body = { 
            message: 'Game deleted successfully',
            freedQuestions: selectedQuestionIds.length
        };
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to delete game' };
    }
}