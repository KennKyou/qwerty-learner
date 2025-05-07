import { DonatingCard } from '../DonatingCard'
import { StickerButton } from '../DonatingCard/components/StickerButton'
import redBookCode from '@/assets/redBook-code.jpg'
import InfoPanel from '@/components/InfoPanel'
import Tooltip from '@/components/Tooltip'
import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import IconMail from '~icons/material-symbols/mail'
import IconCoffee2 from '~icons/mdi/coffee'
import IconXiaoHongShu from '~icons/my-icons/xiaohongshu'
import RiLinksLine from '~icons/ri/links-line'
import IconTwitter from '~icons/ri/twitter-fill'
import IconGithub from '~icons/simple-icons/github'
import IconVisualstudiocode from '~icons/simple-icons/visualstudiocode'
import IconWechat2 from '~icons/simple-icons/wechat'
import IconWechat from '~icons/tabler/brand-wechat'
import IconCoffee from '~icons/tabler/coffee'
import IconTerminal2 from '~icons/tabler/terminal-2'
import IconFlagChina from '~icons/twemoji/flag-china'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)
  const navigate = useNavigate()

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'footer')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="Buy us a coffee"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100 dark:text-amber-300 dark:bg-amber-500"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="text-sm text-gray-500 dark:text-gray-300">
          感謝您使用字感練習生！本專案改編自 Kaiyi
          的開源專案，並將介面及詞彙翻譯成繁體中文以符合台灣使用者的需求。目前網站使用業餘時間維護，為了能夠持續提供優質的服務，我們需要您的贊助！
          <br />
        </p>
        <br />
        <p className="text-sm text-gray-700 dark:text-gray-200">
          您的每一份贊助都將用於維持網站的營運成本，讓我們能夠持續改進功能，打造更好的學習空間。感謝您的支持！
        </p>
        <br />

        <DonatingCard />
      </InfoPanel>

      <footer className="mb-1 mt-4 flex w-full items-center justify-center gap-2.5 text-sm ease-in" onClick={(e) => e.currentTarget.blur()}>
        <a href="https://github.com/KennKyou/qwerty-learner" target="_blank" rel="noreferrer" aria-label="前往 GitHub 專案主頁">
          <IconGithub fontSize={15} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100" />
        </a>
        <button
          className="cursor-pointer focus:outline-none "
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="贊助我們"
        >
          <IconCoffee2 fontSize={16} className="text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-500" />
        </button>

        <a
          href="mailto:ken@kyoudesu.com"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.currentTarget.blur()}
          aria-label="發送 email 到 ken@kyoudesu.com"
        >
          <IconMail fontSize={16} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Qwerty Learner
        </button>
      </footer>
    </>
  )
}

export default Footer
