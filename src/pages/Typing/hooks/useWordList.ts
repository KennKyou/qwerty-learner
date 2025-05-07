import { CHAPTER_LENGTH } from '@/constants'
import { currentChapterAtom, currentDictInfoAtom, reviewModeInfoAtom } from '@/store'
import type { Word, WordWithIndex } from '@/typings/index'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import useSWR from 'swr'

export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom)

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0)
  }

  const isFirstChapter = !isReviewMode && currentDictInfo.id === 'ket' && currentChapter === 0
  const { data: wordList, error, isLoading } = useSWR(currentDictInfo.url, wordListFetcher)

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[]
    if (isFirstChapter) {
      newWords = firstChapter
    } else if (isReviewMode) {
      newWords = reviewRecord?.words ?? []
    } else if (wordList) {
      newWords = wordList.slice(currentChapter * CHAPTER_LENGTH, (currentChapter + 1) * CHAPTER_LENGTH)
    } else {
      newWords = []
    }

    // 记录原始 index, 并对 word.trans 做兜底处理
    return newWords.map((word, index) => {
      let trans: string[]
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === 'string')
      } else if (word.trans === null || word.trans === undefined || typeof word.trans === 'object') {
        trans = []
      } else {
        trans = [String(word.trans)]
      }
      return {
        ...word,
        index,
        trans,
      }
    })
  }, [isFirstChapter, isReviewMode, wordList, reviewRecord?.words, currentChapter])

  return { words, isLoading, error }
}

const firstChapter = [
  { name: 'cancel', trans: ['取消， 撤離； 刪去'], usphone: "'kænsl", ukphone: "'kænsl" },
  { name: 'explosive', trans: ['爆炸的； 極易引起爭論的', '炸藥'], usphone: "ɪk'splosɪv; ɪk'splozɪv", ukphone: "ɪk'spləusɪv" },
  { name: 'numerous', trans: ['眾多的'], usphone: "'numərəs", ukphone: "'njuːmərəs" },
  { name: 'govern', trans: ['居支配地位， 佔優勢', '統治，治理，支配'], usphone: "'ɡʌvɚn", ukphone: "'gʌvn" },
  { name: 'analyse', trans: ['分析； 分解； 解析'], usphone: "'æn(ə)laɪz", ukphone: "'ænəlaɪz" },
  { name: 'discourage', trans: ['使洩氣， 使灰心； 阻止， 勸阻'], usphone: "dɪs'kɝɪdʒ", ukphone: "dɪs'kʌrɪdʒ" },
  { name: 'resemble', trans: ['像， 類似於'], usphone: "rɪ'zɛmbl", ukphone: "rɪ'zembl" },
  {
    name: 'remote',
    trans: ['遙遠的； 偏僻的； 關係疏遠的； 脫離的； 微乎其微的； 孤高的， 冷淡的； 遙控的'],
    usphone: "rɪ'mot",
    ukphone: "rɪ'məut",
  },
  { name: 'salary', trans: ['薪水'], usphone: "'sæləri", ukphone: "'sæləri" },
  { name: 'pollution', trans: ['污染， 污染物'], usphone: "pə'luʃən", ukphone: "pə'luːʃn" },
  { name: 'pretend', trans: ['裝作， 假裝'], usphone: "prɪ'tɛnd", ukphone: "prɪ'tend" },
  { name: 'kettle', trans: ['水壺'], usphone: "'kɛtl", ukphone: "'ketl" },
  { name: 'wreck', trans: ['失事；殘骸；精神或身體已垮的人', '破壞'], usphone: 'rɛk', ukphone: 'rek' },
  { name: 'drunk', trans: ['醉的； 陶醉的'], usphone: 'drʌŋk', ukphone: 'drʌŋk' },
  { name: 'calculate', trans: ['計算； 估計； 計畫'], usphone: "'kælkjulet", ukphone: "'kælkjuleɪt" },
  { name: 'persistent', trans: ['堅持的， 不屈不撓的； 持續不斷的； 反覆出現的'], usphone: "pə'zɪstənt", ukphone: "pə'sɪstənt" },
  { name: 'sake', trans: ['緣故， 理由'], usphone: 'sek', ukphone: 'seɪk' },
  { name: 'conceal', trans: ['把…隱藏起來， 掩蓋， 隱瞞'], usphone: "kən'sil", ukphone: "kən'siːl" },
  { name: 'audience', trans: ['聽眾， 觀眾， 讀者'], usphone: "'ɔdɪəns", ukphone: "'ɔːdiəns" },
  { name: 'meanwhile', trans: ['於此同時'], usphone: "'minwaɪl", ukphone: "'miːnwaɪl" },
]
