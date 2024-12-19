import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import { Home } from "./Home";

const mockNavigate = vi.fn();

vi.mock(import("react-router-dom"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useHistory: () => ({
            push: mockNavigate
        })
    }
})

const mockRecipes = {
    recipes: [{
        id: "1",
        name: "Pasta",
        ingredients: [{ id: "1", name: "Spaghetti" }],
        author_id: "123"
    },
    {
        id: "2",
        name: "Cheeseburger",
        ingredients: [{ id: "2", name: "Cheese" }, { id: "3", name: "Burger" }],
        author_id: "123"
    }]
};

function wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </BrowserRouter>
    );
}

describe("Home", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads and displays recipes", async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve(new Response(JSON.stringify(mockRecipes), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
        );

        render(<Home />, { wrapper });

        expect(screen.getByText("Loading recipes...")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("Pasta")).toBeInTheDocument();
        });
        expect(screen.getAllByRole("button", { name: "View" })).toHaveLength(2);
        expect(screen.getByText("Cheeseburger")).toBeInTheDocument();
    });

    it("can view a recipe", async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve(new Response(JSON.stringify(mockRecipes), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
        );

        render(<Home />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText("Pasta")).toBeInTheDocument();
        });

        const viewButtons = screen.getAllByRole("button", { name: "View" });

        expect(mockNavigate).not.toHaveBeenCalled();
        await userEvent.click(viewButtons[0]);
        expect(mockNavigate).toHaveBeenCalledWith("/recipe/1");
    });
});
