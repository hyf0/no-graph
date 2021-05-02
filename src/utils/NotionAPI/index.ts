import notionFetch from './fetch';
import makeHTML, { handleNotionError } from './helpers';
import { NotionResponse, Options, PageDTO, formatter } from './types';

/**
 * The Notion API Wrapper Class
 */
export class NotionAPI {
  creds: { token: string };
  options: Options;
  /**
   * Creates a new Notion API Wrapper instance
   * if no token is provided it will look for the ENV Variable NOTION_TOKEN
   * @param {Object} Options
   */
  constructor({
    token,
    options = {
      colors: {},
      pageUrl: '/page?id='
    }
  }: {
    token: string;
    options: Options;
  }) {
    const notionToken = token;
    if (!notionToken)
      throw new Error('You need to provide the token to use the API');
    this.creds = {
      token: notionToken
    };
    this.options = options;
  }

  /**
   * Gets all PageIds from the user
   */
  getPages() {
    return notionFetch({ endpoint: 'loadUserContent', creds: this.creds })
      .then((r: NotionResponse) => {
        const pages = r.recordMap.block;
        return Object.keys(pages);
      })
      .catch((e: Error) => {
        handleNotionError(e);
        return [] as Array<string>;
      });
  }

  /**
   * Gets the content of a page by ID as HTML
   * @param {string} pageId The ID of the notion page
   */
  getPageById(
    pageId: string,
    htmlFormatter?: formatter,
    limit?: number,
    ) {
    return notionFetch({
      endpoint: 'loadPageChunk',
      creds: this.creds,
      body: { pageId, limit }
    })
      .then((r: NotionResponse) => {
        const entries = r.recordMap.block;
        const values = Object.values(entries).map(value => {
          const { id, type, properties, format, content, created_time, last_edited_time } = value.value;
          return { id, type, properties, format, content, created_time, last_edited_time };
        });
        return makeHTML(values, this.options, htmlFormatter);
      })
      .catch(
        (e: Error): PageDTO => {
          handleNotionError(e);
          return {};
        }
      );
  }

  /**
   * Method to getAll Pages with metadata starting from the entrypoint.
   * @param startingPageId The ID of the page where your blog home is. Acts as a starting point
   */
  async getPagesByIndexId(startingPageId: string) {
    return notionFetch({
      endpoint: 'loadPageChunk',
      creds: this.creds,
      body: { pageId: startingPageId }
    })
      .then(async (r: NotionResponse) => {
        const entries = Object.values(r.recordMap.block).filter(
          ({ value }) => value.type === 'page'
        );
        return await Promise.all(
          entries.map(({ value }) => this.getPageById(value.id))
        );
      })
      .catch((e: Error) => {
        handleNotionError(e);
        return [] as Array<PageDTO>;
      });
  }

  /**
   * Gets all HTML (WIP)
   */
  async getAllHTML() {
    try {
      const pageIds = (await this.getPages()) as Array<string>;
      const elems = await Promise.all(pageIds.map(id => this.getPageById(id)));
      return elems;
    } catch (error) {
      handleNotionError(error);
      return [];
    }
  }
}