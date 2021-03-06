import { NextPage } from 'next'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'

import { Editor } from '@/components/editor'
import { SiteHeader, SiteHeaderItem } from '@/components/site-header'
import { Button } from '@/components/button'
import { UserIcon } from '@/components/user-icon'
import { usePostArticleMutation } from '@/generated/graphql'

import styles from './index.module.css'

const PostPage: NextPage = () => {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [postArticle] = usePostArticleMutation()
  const [postDisabled, setPostDisabled] = useState(false)
  const router = useRouter()

  const handleChangeSubject = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSubject(ev.target.value)
    },
    [],
  )

  const handlePost = useCallback(
    async (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      if (!content || !subject || postDisabled) {
        return
      }

      setPostDisabled(true)
      const { data } = await postArticle({
        variables: {
          authorId: 'b351437f-a03b-4148-b581-22edc9151815',
          content,
          subject,
          publishedAt: 'now()',
        },
      })
      if (data && data.insert_articles_one) {
        const articleId = data.insert_articles_one.id
        router.push(`/hoge/${articleId}`)
        setPostDisabled(false)
      } else {
        console.log('POST unknown state', data)
      }
    },
    [content, subject, postDisabled, postArticle, router],
  )

  const SiteHeaderRight = (
    <>
      <SiteHeaderItem>
        <form onSubmit={handlePost}>
          <Button type="submit">
            <span>投稿する</span>
          </Button>
        </form>
      </SiteHeaderItem>
      <SiteHeaderItem>
        <UserIcon src="/profile.jpg" />
      </SiteHeaderItem>
    </>
  )

  return (
    <>
      <SiteHeader right={SiteHeaderRight} />
      <div className={styles.editContent}>
        <input
          className={styles.subject}
          type="text"
          placeholder="タイトル"
          value={subject}
          onChange={handleChangeSubject}
        />
        <Editor
          className={styles.editor}
          placeholder="本文を書きましょう"
          value={content}
          onEdit={setContent}
        />
      </div>
    </>
  )
}

export default PostPage
