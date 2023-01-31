export const getNews = async () => (
    fetch('https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=news&page_size=1', {
        headers: {
            "X-API-KEY": "Bq5Fw2yQRpCebvtZGFwbJ2sJNHJorepGa7D7GUiMe_Y"
        }
    }).then(res => res.json())
)