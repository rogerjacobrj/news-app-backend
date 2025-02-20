import { GUARDIAN_URL, NEWYORK_TIMES_URL, NEWSAPI_URL } from '../constants';
import axios from 'axios';

interface ArticleQuery {
  source?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

// Fetch all articles
export const getArticles = async (query: ArticleQuery) => {
  const { source = 'guardian', keyword, page = 1, size = 10 } = query;

  const queryParams = [];
  let endpoint: string = '';
  let sections: any = [];

  switch (source) {
    case 'guardian': {
      endpoint = `${GUARDIAN_URL}/search`;

      queryParams.push(`page=${page}`);
      queryParams.push(`page-size=${size}`);
      queryParams.push(`show-fields=headline,thumbnail,byline`);
      // queryParams.push(`show-tags=contributor`);
      queryParams.push(`api-key=${process.env.GUARDIAN_API_KEY!}`);

      keyword && queryParams.push(`q=${keyword}`);

      sections = await getSections();

      break;
    }

    case 'newyork_times': {
      endpoint = `${NEWYORK_TIMES_URL}`;

      queryParams.push(`fq=section_name:("Technology")`);
      queryParams.push(`page=${page}`);
      queryParams.push(`size=${size}`);
      queryParams.push(`api-key=${process.env.NEWYORK_TIMES_API_KEY!}`);

      break;
    }

    case 'news_api': {
      endpoint = `${NEWSAPI_URL}/everything`;

      queryParams.push(`q=${keyword ? keyword : 'anything'}`); // API requires some "keyword" to minimize results (mandatory field)
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
    console.log(url);

    const response = await axios.get(url);

    let results: any = [];

    if (source === 'guardian') {
      results = response?.data?.response?.results;
    } else if (source === 'newyork_times') {
      results = response?.data?.response?.docs;
    } else if (source === 'news_api') {
      results = response?.data?.articles;
    }

    // format the data for consistent keys & data
    return {
      status: true,
      sections,
      articles: results,
    };
  } catch (error) {
    return {
      status: false,
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
