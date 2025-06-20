import { RouterContext } from "oak/router";
import Question from "../../models/Question.ts";
import Game from "../../models/Game.ts";

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
        const game = await Game.create(body);
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
        const game = await Game.findById(id);
        ctx.response.status = 200;
        ctx.response.body = game;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = { error: error instanceof Error ? error.message : 'Failed to get game' };
    }
}