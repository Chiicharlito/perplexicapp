import { render, screen } from "@/testing";
import { ThemedText } from "../ThemedText";

describe("ThemedText", () => {
  it("renders text content", () => {
    render(<ThemedText>Hello World</ThemedText>);
    expect(screen.getByText("Hello World")).toBeOnTheScreen();
  });
});
