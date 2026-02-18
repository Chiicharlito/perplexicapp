import React from "react";
import { View, Animated, StyleSheet } from "react-native";

const SkeletonLoader = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.9],
  });

  const Line = () => (
    <Animated.View
      style={[
        styles.line,
        {
          opacity,
        },
      ]}
    />
  );

  const ShortLine = () => (
    <Animated.View
      style={[
        styles.shortLine,
        {
          opacity,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <Line />
      <Line />
      <ShortLine />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  line: {
    height: 10,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
  shortLine: {
    height: 10,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
});

export default SkeletonLoader;
