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
    date: transformDate('guardian', data?.webPublicationDate),
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
    date: formatNewyorkTimesDate(data.pub_date),
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
    date: transformDate('news_api', data?.publishedAt),
    title: data?.title,
    url: data?.url,
    author: data?.author,
    thumbnail: data?.urlToImage,
  };
};

const transformDate = (source: string, date: string) => {
  if (source === 'guardian' || source === 'news_api') {
    return formatArticleDate(date);
  }
};

const formatArticleDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  return formattedDate;
};

const formatNewyorkTimesDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  };

  return date.toLocaleDateString('en-GB', options);
};

export const getAuthors = (source: string, data: any) => {
  const authors = [];

  for (let i = 0; i < data.length; i++) {
    authors.push({
      id: data[i].author,
      name: data[i].author,
    });
  }

  return authors;
};

export const getCategories = (source: string, data: any) => {
  const categories = [];

  for (let i = 0; i < data.length; i++) {
    if (source === 'guardian' || source === 'newyork_times') {
      categories.push({
        id: data[i].category,
        name: data[i].category,
      });
    }
  }

  return categories;
};

export const convertString = (input: string): string => {
  const parts = input.split(',');

  const quotedParts = parts.map((part) => `"${part.trim()}"`);

  return quotedParts.join(', ');
};
