import { NEWYORK_TIMES_MEDIA_URL } from '../constants';

// Format 'Guardian' section data
export const formatGuadianSectionData = (data: any) => {
  const formattedResults = [];

  for (let i = 0; i < data.length; i++) {
    const item = formatGuardianSection(data[i]);
    formattedResults.push(item);
  }

  return formattedResults;
};

// Format 'Guardian' section item
const formatGuardianSection = (data: any) => {
  return {
    id: data?.id,
    title: data?.webTitle,
  };
};

// Format article data from all sources
export const formatDataFromSources = (source: string, data: any) => {
  const formattedResults = [];

  for (let i = 0; i < data.length; i++) {
    if (source === 'guardian') {
      const item = formatGuardianData(data[i]);
      formattedResults.push(item);
    } else if (source === 'newyork_times') {
      const item = formatNewyorkTimesData(data[i]);
      formattedResults.push(item);
    } else if (source === 'news_api') {
      const item = formatNewsApiData(data[i]);
      formattedResults.push(item);
    }
  }

  return formattedResults;
};

// Format 'Guardian' data
const formatGuardianData = (data: any) => {
  return {
    id: data?.id,
    category: data?.sectionName,
    date: data?.webPublicationDate,
    title: data?.webTitle,
    url: data?.webUrl,
    author: data?.fields?.byline?.replace('(now)', '')?.replace('(earlier)', ''),
    thumbnail: data?.fields?.thumbnail,
  };
};

// Format 'New York Times' data
const formatNewyorkTimesData = (data: any) => {
  const media = data?.multimedia?.find(
    (item: any) =>
      item.subtype === 'superJumbo' || item.subtype === 'xlarge' || item.subtype === 'slide'
  );

  return {
    id: data?._id,
    category: data?.section_name,
    date: data.pub_date,
    title: data?.headline?.main,
    url: data?.web_url,
    author: data?.byline?.original?.replace('By', '')?.replace('and', '&'),
    thumbnail: media?.url
      ? `${NEWYORK_TIMES_MEDIA_URL}/${media?.url}`
      : 'https://placehold.co/600x400',
  };
};

// Format 'News API' data
const formatNewsApiData = (data: any) => {
  return {
    id: data?.url,
    category: '',
    date: data?.publishedAt,
    title: data?.title,
    url: data?.url,
    author: data?.author,
    thumbnail: data?.urlToImage,
  };
};
