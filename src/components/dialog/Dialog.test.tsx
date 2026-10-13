import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dialog, ConfirmDialog } from "./Dialog";
import { Button } from "../button";

afterEach(cleanup);

describe("Dialog", () => {
  it("renders when isOpen is true", () => {
    render(<Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">Content</Dialog>);
    expect(screen.getByRole("dialog", { name: "Test Dialog" })).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<Dialog isOpen={false} onClose={vi.fn()} title="Test Dialog">Content</Dialog>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog" description="This is a description">
        Content
      </Dialog>,
    );
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Dialog isOpen={true} onClose={onClose} title="Test Dialog">Content</Dialog>);
    fireEvent.click(screen.getByLabelText("Close dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay clicked", () => {
    const onClose = vi.fn();
    render(<Dialog isOpen={true} onClose={onClose} title="Test Dialog">Content</Dialog>);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on overlay click when preventCloseOnOverlayClick", () => {
    const onClose = vi.fn();
    render(
      <Dialog isOpen={true} onClose={onClose} title="Test Dialog" preventCloseOnOverlayClick>
        Content
      </Dialog>,
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(<Dialog isOpen={true} onClose={onClose} title="Test Dialog">Content</Dialog>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when preventCloseOnEscape", () => {
    const onClose = vi.fn();
    render(
      <Dialog isOpen={true} onClose={onClose} title="Test Dialog" preventCloseOnEscape>
        Content
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("applies size classes to content", () => {
    const { rerender } = render(<Dialog isOpen={true} onClose={vi.fn()} title="Test" size="sm">Content</Dialog>);
    const content = screen.getByText("Content").closest("div[role='dialog']")?.querySelector(".max-w-sm");
    expect(content).toBeInTheDocument();

    rerender(<Dialog isOpen={true} onClose={vi.fn()} title="Test" size="lg">Content</Dialog>);
    const contentLg = screen.getByText("Content").closest("div[role='dialog']")?.querySelector(".max-w-lg");
    expect(contentLg).toBeInTheDocument();

    rerender(<Dialog isOpen={true} onClose={vi.fn()} title="Test" size="xl">Content</Dialog>);
    const contentXl = screen.getByText("Content").closest("div[role='dialog']")?.querySelector(".max-w-xl");
    expect(contentXl).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(
      <Dialog
        isOpen={true}
        onClose={vi.fn()}
        title="Test Dialog"
        footer={<Button variant="primary">Save</Button>}
      >
        Content
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("hides close button when showCloseButton is false", () => {
    render(<Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog" showCloseButton={false}>Content</Dialog>);
    expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument();
  });

  it("passes custom classNames", () => {
    render(
      <Dialog
        isOpen={true}
        onClose={vi.fn()}
        title="Test Dialog"
        className="custom-class"
        overlayClassName="overlay-custom"
        contentClassName="content-custom"
      >
        Content
      </Dialog>,
    );
    const content = screen.getByText("Content").closest("div[role='dialog']")?.querySelector(".content-custom");
    expect(content).toBeInTheDocument();
  });
});

describe("ConfirmDialog", () => {
  it("renders with title, message, and buttons", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirm Action"
        message="Are you sure?"
      />,
    );
    expect(screen.getByRole("dialog", { name: "Confirm Action" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Confirm"
        message="Sure?"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button clicked", () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Confirm"
        message="Sure?"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on confirm button", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirm"
        message="Sure?"
        isLoading
      />,
    );
    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveAttribute("aria-busy", "true");
  });

  it("uses danger variant when specified", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirm"
        message="Sure?"
        variant="danger"
      />,
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("bg-red-600");
  });

  it("does not close on Escape or overlay click", () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Confirm"
        message="Sure?"
      />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });
});