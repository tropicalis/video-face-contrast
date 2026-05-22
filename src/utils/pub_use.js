const getAssetsFile = (url) => {
    return new URL(`../assets/icon/${url}`, import.meta.url).href
  }

//导出
export default getAssetsFile