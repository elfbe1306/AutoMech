import { StyleSheet, Text, View, ScrollView, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ReturnButton from '@/components/ReturnButton';

const timelineData = [
  { date: 'T2 10.3.25', time: '13:05', title: 'Bài tập lớn 1', primary: true },
  { date: 'T5 13.3.25', time: '07:20', title: 'Bài tập lớn 2', primary: false },
  { date: 'CN 9.3.25', time: '13:05', title: 'Đồ án đa ngành', primary: true },
  { date: 'T6 10.2.22', time: '13:05', title: 'Bài tập lớn 1', primary: false },
  { date: 'T3 12.3.21', time: '09:30', title: 'Bài tập lớn 2', primary: true },
  { date: 'T2 28.6.04', time: '11:00', title: 'Đồ án đa ngành', primary: false },
];

const TimelineItem = ({ item, isLast }) => (
  <View style={styles.itemContainer}>
    {/* Time column */}
    <View style={styles.timeContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>

    {/* Middle timeline column */}
    <View style={styles.timelineContainer}>
      <View style={styles.circle} />
      {!isLast && <View style={styles.verticalLine} />}
    </View>

    {/* Content box */}
    <View style={[styles.contentBox, item.primary ? styles.contentBox : styles.whiteBox]}>
      <Text style={[styles.titleContent, item.primary ? styles.titleContent : styles.titleWhiteBox]}>{item.title}</Text>
      <Text style={[styles.desc, item.primary? styles.desc: styles.descWhiteBox]}>Kết quả tính toán</Text>
      <Text style={[styles.desc, item.primary? styles.desc: styles.descWhiteBox]}>Chi tiết máy đã chọn</Text>
    </View>
  </View>
);


const History = () => {
  const router = useRouter();

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH CHỌN CHI TIẾT MÁY</Text>
      </View>

      <SafeAreaView>
        <FlatList
          data={timelineData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TimelineItem item={item} isLast={index === timelineData.length} />
          )}
        />
      </SafeAreaView>
    </View>
  )
}

export default History

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 20,
    color: 'rgb(33, 53, 85)'
  },

  itemContainer: {
    flexDirection: 'row',
    paddingRight: 40,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  timeContainer: {
    width: 100,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  date: {
    color: '#213555',
    fontWeight: 'bold',
    color: '#1D1E4F',
  },
  time: {
    color: '#3E5879',
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#213555',
    borderRadius: 20,
    paddingInline: 15,
    paddingVertical:10,
    width: 20,
    marginLeft: 10,
    justifyContent: "center",
  },
  whiteBox: {
    backgroundColor: '#F5EFE7',
  },
  titleContent: {
    fontSize: 14,
    fontFamily: 'quicksand-bold',
    fontWeight: '600',
    color: '#D8C4B6',
    marginBottom: 6,
  },
  titleWhiteBox: {
    color:'#213555'
  },
  desc: {
    fontFamily: 'quicksand-bold',
    fontSize: 12,
    color: '#F5EFE7',
    marginBottom: 6,
  },
  descWhiteBox:{
    color: '#3E5879'
  },
//   timelineContainer: {
//   alignItems: 'center',
//   position: 'relative',
// },
// circle: {
//   width: 10,
//   height: 10,
//   borderRadius: 5,
//   backgroundColor: '#1D1E4F',
//   zIndex: 1,
// },
// verticalLine: {
//   position: 'absolute',
//   top: 10,
//   width: 2,
//   height: '100%',
//   backgroundColor: '#1D1E4F',
//   zIndex: 0,
// },
})