import { RouterContext } from "oak/router";
import Question from "../../models/Question.ts";
import Category from "../../models/Category.ts";
// Create a new question
export async function createQuestion(ctx: RouterContext<"/questions">) {
  try {
    const body = await ctx.request.body.json();
    const category = await Category.findById(body.category);
    if (!category) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Category not found' };
      return;
    }
    
    // Create the question first
    const question = await Question.create(body);
    
    // Then update the category with the question ID
    await Category.findByIdAndUpdate(category._id, { $push: { questions: question._id } });
    
    ctx.response.status = 201;
    ctx.response.body = question;
  } catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: error instanceof Error ? error.message : 'Failed to create question'
    };
  }
}

// Get all questions
export async function getQuestions(ctx: RouterContext<"/questions">) {
  try {
   
    const questions = await Question.find()
    
    ctx.response.body = questions;
  } catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: error instanceof Error ? error.message : 'Failed to fetch questions'
    };
  }
}

// Get a single question by ID
export async function getQuestion(ctx: RouterContext<"/questions/:id">) {
  try {
    const { id } = ctx.params;

    const question = await Question.findById(id).populate('category')
    
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Question not found' };
      return;
    }
    
    ctx.response.body = question;
  } catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: error instanceof Error ? error.message : 'Failed to fetch question'
    };
  }
}

// Update a question
export async function updateQuestion(ctx: RouterContext<"/questions/:id">) {
  try {
    const { id } = ctx.params;
    const body = await ctx.request.body.json();
    
    // Get the existing question first
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Question not found' };
      return;
    }
    
    // If category is being changed, update both categories
    if (body.category && body.category !== existingQuestion.category.toString()) {
      const newCategory = await Category.findById(body.category);
      if (!newCategory) {
        ctx.response.status = 404;
        ctx.response.body = { error: 'Category not found' };
        return;
      }
      
      // Remove from old category
      await Category.findByIdAndUpdate(existingQuestion.category, { $pull: { questions: id } });
      // Add to new category
      await Category.findByIdAndUpdate(body.category, { $push: { questions: id } });
    }
    
    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('category');
    
    ctx.response.body = updatedQuestion;
  } catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: error instanceof Error ? error.message : 'Failed to update question'
    };
  }
}

// Delete a question
export async function deleteQuestion(ctx: RouterContext<"/questions/:id">) {
  try {
    const { id } = ctx.params;
  
    
    const question = await Question.findById(id);
    
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { error: 'Question not found' };
      return;
    }
    
    // Remove the question from its category
    await Category.findByIdAndUpdate(question.category, { $pull: { questions: id } });
    
    // Delete the question
    await Question.findByIdAndDelete(id);
    
    ctx.response.body = { message: 'Question deleted successfully' };
  } catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: error instanceof Error ? error.message : 'Failed to delete question'
    };
  }
} 