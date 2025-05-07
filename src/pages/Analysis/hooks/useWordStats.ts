import { db } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { Activity } from 'react-activity-calendar'

interface IWordStats {
  isEmpty?: boolean
  exerciseRecord: Activity[]
  wordRecord: Activity[]
  wpmRecord: [string, number][]
  accuracyRecord: [string, number][]
  wrongTimeRecord: { name: string; value: number }[]
}

// 获取两个日期之间的所有日期，使用dayjs计算
function getDatesBetween(start: number, end: number) {
  const dates = []
  let curr = dayjs(start).startOf('day')
  const last = dayjs(end).endOf('day')

  while (curr.diff(last) < 0) {
    dates.push(curr.clone().format('YYYY-MM-DD'))
    curr = curr.add(1, 'day')
  }

  return dates
}

function getLevel(value: number) {
  if (value === 0) return 0
  else if (value < 4) return 1
  else if (value < 8) return 2
  else if (value < 12) return 3
  else return 4
}

export function useWordStats(startTimeStamp: number, endTimeStamp: number) {
  const [wordStats, setWordStats] = useState<IWordStats>({
    exerciseRecord: [],
    wordRecord: [],
    wpmRecord: [],
    accuracyRecord: [],
    wrongTimeRecord: [],
  })

  useEffect(() => {
    const fetchWordStats = async () => {
      const stats = await getChapterStats(startTimeStamp, endTimeStamp)
      setWordStats(stats)
    }

    fetchWordStats()
  }, [startTimeStamp, endTimeStamp])

  return wordStats
}

async function getChapterStats(startTimeStamp: number, endTimeStamp: number): Promise<IWordStats> {
  // indexedDB查找某个数字范围内的数据
  const records: IWordRecord[] = await db.wordRecords.where('timeStamp').between(startTimeStamp, endTimeStamp).toArray()

  if (records.length === 0) {
    return { isEmpty: true, exerciseRecord: [], wordRecord: [], wpmRecord: [], accuracyRecord: [], wrongTimeRecord: [] }
  }

  let data: {
    [x: string]: {
      exerciseTime: number //練習次數
      words: string[] //練習詞 array（不去重）
      totalTime: number //總計用時
      wrongCount: number //錯誤次數
      wrongKeys: string[] //按錯的按鍵
    }
  } = {}

  const dates = getDatesBetween(startTimeStamp * 1000, endTimeStamp * 1000)
  data = dates
    .map((date) => ({ [date]: { exerciseTime: 0, words: [], totalTime: 0, wrongCount: 0, wrongKeys: [] } }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})

  for (let i = 0; i < records.length; i++) {
    const date = dayjs(records[i].timeStamp * 1000).format('YYYY-MM-DD')

    data[date].exerciseTime = data[date].exerciseTime + 1
    data[date].words = [...data[date].words, records[i].word]
    data[date].totalTime = data[date].totalTime + records[i].timing.reduce((acc, curr) => acc + curr, 0)
    data[date].wrongCount = data[date].wrongCount + records[i].wrongCount
    data[date].wrongKeys = [...(data[date].wrongKeys || []), ...(Object.values(records[i].mistakes).flat() || [])]
  }

  const RecordArray = Object.entries(data)

  // 練習次數統計
  const exerciseRecord: IWordStats['exerciseRecord'] = RecordArray.map(([date, { exerciseTime }]) => ({
    date,
    count: exerciseTime,
    level: getLevel(exerciseTime),
  }))
  // 練習詞數統計（去重）
  const wordRecord: IWordStats['wordRecord'] = RecordArray.map(([date, { words }]) => ({
    date,
    count: Array.from(new Set(words)).length,
    level: getLevel(Array.from(new Set(words)).length),
  }))
  // wpm=練習詞數（不去重）/總時間
  const wpmRecord: IWordStats['wpmRecord'] = RecordArray.map<[string, number]>(([date, { words, totalTime }]) => [
    date,
    Math.round(words.length / (totalTime / 1000 / 60)),
  ]).filter((d) => d[1])
  // 正確率=每個單字的長度合計/(每個單字的長度合計+總錯誤次數)
  const accuracyRecord: IWordStats['accuracyRecord'] = RecordArray.map<[string, number]>(([date, { words, wrongCount }]) => [
    date,
    Math.round((words.join('').length / (words.join('').length + wrongCount)) * 100),
  ]).filter((d) => d[1])
  // 錯誤次數統計
  const wrongTimeRecord: IWordStats['wrongTimeRecord'] = []
  const allWrongTime = RecordArray.map(([, { wrongKeys }]) => wrongKeys)
    .flat()
    .map((key) => key.toUpperCase())
  allWrongTime.forEach((key) => {
    const index = wrongTimeRecord.findIndex((item) => item.name === key)
    if (index === -1) {
      wrongTimeRecord.push({ name: key, value: 1 })
    } else {
      wrongTimeRecord[index].value++
    }
  })

  return { exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord }
}
