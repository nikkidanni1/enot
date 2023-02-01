export const getNews = async () => (
    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=1').then(res => res.json())
)