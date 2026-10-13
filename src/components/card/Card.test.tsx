import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card, CardHeader, CardContent, CardFooter } from "./Card";
import { Button } from "../button";

afterEach(cleanup);

describe("Card", () => {
  it("renders with default props", () => {
    render(<Card data-testid="card">Card content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("p-6");
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Card data-testid="card" variant="default">Default</Card>);
    expect(screen.getByTestId("card")).toHaveClass("bg-white");

    rerender(<Card data-testid="card" variant="outlined">Outlined</Card>);
    expect(screen.getByTestId("card")).toHaveClass("border");
    expect(screen.getByTestId("card")).toHaveClass("border-gray-200");

    rerender(<Card data-testid="card" variant="elevated">Elevated</Card>);
    expect(screen.getByTestId("card")).toHaveClass("shadow-lg");
  });

  it("applies padding classes", () => {
    const { rerender } = render(<Card data-testid="card" padding="none">No padding</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass("p-4");
    expect(screen.getByTestId("card")).not.toHaveClass("p-6");
    expect(screen.getByTestId("card")).not.toHaveClass("p-8");

    rerender(<Card data-testid="card" padding="sm">Small padding</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-4");

    rerender(<Card data-testid="card" padding="md">Medium padding</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-6");

    rerender(<Card data-testid="card" padding="lg">Large padding</Card>);
    expect(screen.getByTestId("card")).toHaveClass("p-8");
  });

  it("applies hoverable styles", () => {
    render(<Card data-testid="card" hoverable>Hoverable</Card>);
    expect(screen.getByTestId("card")).toHaveClass("hover:shadow-md");
    expect(screen.getByTestId("card")).toHaveClass("cursor-pointer");
  });

  it("applies bordered styles", () => {
    render(<Card data-testid="card" bordered>Bordered</Card>);
    expect(screen.getByTestId("card")).toHaveClass("border");
    expect(screen.getByTestId("card")).toHaveClass("border-gray-200");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("applies custom className", () => {
    render(<Card data-testid="card" className="custom-class">Custom</Card>);
    expect(screen.getByTestId("card")).toHaveClass("custom-class");
  });
});

describe("CardHeader", () => {
  it("renders title", () => {
    render(<CardHeader title="Card Title" />);
    expect(screen.getByRole("heading", { name: "Card Title", level: 3 })).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<CardHeader title="Card Title" subtitle="Card subtitle" />);
    expect(screen.getByText("Card subtitle")).toBeInTheDocument();
  });

  it("renders action", () => {
    render(<CardHeader title="Card Title" action={<Button>Action</Button>} />);
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<CardHeader title="Card Title"><span data-testid="child">Child content</span></CardHeader>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardHeader ref={ref} title="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Card content</CardContent>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("CardFooter", () => {
  it("renders children with divided border", () => {
    render(<CardFooter><Button>Save</Button></CardFooter>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" }).parentElement).toHaveClass("border-t");
  });

  it("renders without divided border when divided={false}", () => {
    render(<CardFooter divided={false}><Button>Save</Button></CardFooter>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" }).parentElement).not.toHaveClass("border-t");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CardFooter ref={ref}><Button>Save</Button></CardFooter>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("Card composition", () => {
  it("composes header, content, and footer", () => {
    render(
      <Card>
        <CardHeader title="Title" subtitle="Subtitle" />
        <CardContent>Content</CardContent>
        <CardFooter><Button>Action</Button></CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("exposes sub-components on Card", () => {
    expect(Card.Header).toBe(CardHeader);
    expect(Card.Content).toBe(CardContent);
    expect(Card.Footer).toBe(CardFooter);
  });
});