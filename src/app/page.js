import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

async function getHnFrontPageStories() {
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=20');
    if (!res.ok) {
      throw new Error('Failed to fetch hackernews top stories');
    }
  
    const stories = await res.json();

    return stories.hits.sort((story, nextStory) => (story.points < nextStory.points ? 1 : -1))
    } catch (error) {
      console.error('Error while fetching stories' , error);
      return [];
    }  
}

export default async function Home() {
  const stories = await getHnFrontPageStories();

  return (
    <main className={styles.main}>      
      <div className='wrapper'>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          /> 
          <div className={styles.card}> Hacker News </div>
        </div>
        <div className="stories-wrapper">
          {stories.length === 0 && <div className='stories-list'>Could not load HN stories, try again later.</div>}
          {stories.length > 0 &&
            stories.map(({ objectID, url, title, author, points }) => (
              title && url &&
              <div className='stories-list' key={objectID}>
                <li><Link href={url} target="_blank" rel="noreferrer">{title}</Link> - By <b>{author}</b> ({points} points)</li>
              </div>                        
            ))}
        </div>
      </div>
    </main>
  )
}
