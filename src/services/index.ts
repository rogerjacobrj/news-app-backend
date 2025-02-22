import axios from 'axios';
import { GUARDIAN_URL, NEWYORK_TIMES_URL, NEWSAPI_URL } from '../constants';
import {
  convertString,
  formatDataFromSources,
  formatGuadianSectionData,
  getAuthors,
  getCategories,
} from '../helpers';

interface ArticleQuery {
  source?: string;
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  from_date?: string;
  to_date?: string;
}

// Fetch all articles
export const getArticles = async (requestQuery: ArticleQuery) => {
  const {
    source = 'guardian',
    query,
    page = 1,
    size = 10,
    sort,
    category,
    from_date,
    to_date,
  } = requestQuery;

  const queryParams = [];
  let endpoint: string = '';
  let sections: any = [];

  switch (source) {
    case 'guardian': {
      endpoint = `${GUARDIAN_URL}/search`;

      queryParams.push(`page=${page}`);
      queryParams.push(`page-size=${size}`);
      sort && queryParams.push(`order-by=${sort}`);

      queryParams.push(`show-fields=headline,thumbnail,byline`);
      // queryParams.push(`show-tags=contributor`);
      query && queryParams.push(`q=${query}`);

      if (from_date && to_date) {
        queryParams.push(`from_date=${from_date}`);
        queryParams.push(`to_date=${to_date}`);
      }

      queryParams.push(`api-key=${process.env.GUARDIAN_API_KEY!}`);

      sections = await getSections();

      break;
    }

    case 'newyork_times': {
      endpoint = `${NEWYORK_TIMES_URL}`;
      category && queryParams.push(`fq=section_name:(${convertString(category)})`);
      queryParams.push(`page=${page}`);
      sort && queryParams.push(`sort=${sort}`);
      query && queryParams.push(`q=${query}`);

      if (from_date && to_date) {
        queryParams.push(`begin_date=${from_date}`);
        queryParams.push(`end_date=${to_date}`);
      }
      queryParams.push(`api-key=${process.env.NEWYORK_TIMES_API_KEY!}`);
      break;
    }

    case 'news_api': {
      endpoint = `${NEWSAPI_URL}/everything`;
      queryParams.push(`page=${page}`);
      queryParams.push(`pageSize=${size}`);
      sort && queryParams.push(`sortBy=${sort === 'newest' ? 'publishedAt' : 'relevancy'}`);
      queryParams.push(`q=${query ? query : 'anything'}`); // API requires some "keyword" to minimize results (mandatory field)
      if (from_date && to_date) {
        queryParams.push(`from=${from_date}`);
        queryParams.push(`to=${to_date}`);
      }
      queryParams.push(`apiKey=${process.env.NEWSAPI_API_KEY!}`);
      break;
    }

    default: {
      endpoint = GUARDIAN_URL;
      break;
    }
  }

  try {
    const url: string = `${endpoint}?${queryParams.join('&')}`;

    const response = await axios.get(url);

    let results: any = [];
    let authors: any = [];
    let categories: any = [];

    if (source === 'guardian') {
      results = response?.data?.response?.results;
    } else if (source === 'newyork_times') {
      results = response?.data?.response?.docs;
    } else if (source === 'news_api') {
      results = response?.data?.articles;
    }

    const formattedResults = formatDataFromSources(source, results);
    authors = getAuthors(source, formattedResults);
    categories = getCategories(source, formattedResults);

    return {
      status: true,
      authors,
      sections: formatGuadianSectionData(sections),
      articles: formattedResults,
      categories,
    };
  } catch (error) {
    return {
      status: false,
      categories: [],
      sections: [],
      articles: [],
      message: 'Failed to fetch articles',
    };
  }
};

export const getSections = async () => {
  try {
    const response: any = await axios.get(
      `${GUARDIAN_URL}/sections?api-key=${process.env.GUARDIAN_API_KEY!}`
    );
    return response?.data?.response?.results;
  } catch (error) {
    return [];
  }
};
