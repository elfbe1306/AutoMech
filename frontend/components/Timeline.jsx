// TimelineItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timeline = ({ day, time, title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeColumn}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.verticalLineContainer}>
        <View style={styles.circle} />
        <View style={styles.verticalLine} />
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.titleContent}>{title}</Text>
        {/* <Text style={styles.content}>{result}</Text>
        <Text style={styles.content}>{detail}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingRight: 40,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  timeColumn: {
    width: 100,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  dayText: {
    fontFamily: 'quicksand-bold',
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  timeText: {
    fontFamily: 'quicksand-bold',
    fontSize: 14,
    color: '#2c3e50',
    marginTop: 8,
  },
  verticalLineContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1e335a',
    marginBottom: 2,
  },
  verticalLine: {
    width: 4,
    height: '100%',
    backgroundColor: '#1e335a',
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#1e335a',
    borderRadius: 30,
    paddingInline: 15,
    width: 20,
    marginLeft: 10,
    justifyContent: "center",
  },
  primaryBox: {
    backgroundColor: '#1e335a',
  },
  secondaryBox: {
    backgroundColor: '#f8f1ea',
  },
  titleContent: {
    fontSize: 14,
    fontFamily: 'quicksand-bold',
    fontWeight: '600',
    color: '#D8C4B6',
    marginBottom: 6,
  },
  primaryTitle: {
    color: '#e5d8ce',
  },
  secondaryTitle: {
    color: '#1e335a',
  },
  content: {
    fontFamily: 'quicksand-bold',
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 6,
  },
});

export default Timeline;
