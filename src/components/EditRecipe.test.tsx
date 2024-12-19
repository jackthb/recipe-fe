import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route } from "react-router-dom";
import { EditRecipe } from "./EditRecipe";
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

const mockRecipe = {
    id: "1",
    name: "Pasta",
    ingredients: [{ id: "1", name: "Spaghetti" }],
    author_id: "123"
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
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Route path="/edit/:id">{children}</Route>
            </MemoryRouter>
        </QueryClientProvider>
    );
}

describe("EditRecipe", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads and displays recipe data", async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve(new Response(JSON.stringify(mockRecipe), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
        );

        render(<EditRecipe />, { wrapper });

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByDisplayValue("Pasta")).toBeInTheDocument();
        });
    });
    
    it("submits updated recipe data", async () => {
        globalThis.fetch = vi.fn()
            .mockResolvedValueOnce(new Response(JSON.stringify(mockRecipe), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ ...mockRecipe, name: "Updated Pasta" }), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }));

        render(<EditRecipe />, { wrapper });

        await waitFor(() => {
            expect(screen.getByDisplayValue("Pasta")).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText(/name/i);
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "Updated Pasta");

        const submitButton = screen.getByRole("button", { name: /save/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/recipe/1"),
                expect.objectContaining({
                    method: "PATCH",
                    body: expect.stringContaining("Updated Pasta"),
                })
            );
        });
    });

    it("handles API errors", async () => {
        const mock = vi.fn()

        mock.mockRejectedValueOnce(new Error("API Error"));

        render(<EditRecipe />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });
    });
});
