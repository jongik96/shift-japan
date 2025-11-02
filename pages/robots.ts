import { GetServerSideProps } from 'next'

function Robots() {
  return null
}

export default Robots

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://shiftjapaninsight.com'
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

