import * as React from "react";
// @ts-expect-error react-test-renderer lacks types in React 19
import renderer from "react-test-renderer";

import { ThemedText } from "../ThemedText";

it(`renders correctly`, () => {
  const tree = renderer
    .create(<ThemedText>Snapshot test!</ThemedText>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
