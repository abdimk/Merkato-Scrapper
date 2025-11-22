import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
import random
import logging

BASE_URL = "https://www.2merkato.com"
SEARCH_URL_TEMPLATE = BASE_URL + "/search/newest-first?searchphrase=all&searchword={query}"
PAGINATED_URL_TEMPLATE = BASE_URL + "/search/newest-first/page:{page}?searchphrase=all&searchword={query}"

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
]


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_random_headers():
    return {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': BASE_URL,
    }


def clean_na(value):
    """Converts the literal string 'N/A' to None."""
    if isinstance(value, str) and value.strip().lower() == "n/a":
        return None
    return value

def parse_listing_details(html_content, url):
    soup = BeautifulSoup(html_content, 'html.parser')
    data = {"url": url}

  
    data['company_name'] = soup.find('h2').text.strip() if soup.find('h2') else "N/A"


    logo_img = soup.select_one('.span4 .thumbnail img') or soup.select_one('.listing-desc img')
    data['logo_url'] = clean_na(urljoin(BASE_URL, logo_img.get('src')) if logo_img and logo_img.get('src') else "N/A")

 
    data.update({'phone_main': "N/A", 'location': "N/A", 'primary_category': "N/A"})
    contact_table = soup.find('table', class_='table-condensed')
    if contact_table:
        for row in contact_table.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) == 2:
                label = cells[0].text.strip().lower()
                value = cells[1].text.strip()
                if 'mobile' in label and data['phone_main'] == "N/A":
                    data['phone_main'] = value
                elif 'location' in label:
                    data['location'] = value
                elif 'primary category' in label:
                    data['primary_category'] = cells[1].a.text.strip() if cells[1].a else value

  
    website_link = soup.find('a', string=lambda t: t and 'Visit Website' in t)
    data['website'] = clean_na(website_link.get('href') if website_link else "N/A")


    data['email'] = "N/A"
    footer_ul = soup.find('ul', class_='btn-info')
    if footer_ul:
        footer_text = footer_ul.get_text(separator='|', strip=True)
        email_match = re.search(r'Email:-\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', footer_text)
        if email_match:
            data['email'] = email_match.group(1).strip()
        phone_match = re.search(r'Phone no:-\s*([\+\d\s-]+)', footer_text)
        if data['phone_main'] == "N/A" and phone_match:
            data['phone_main'] = phone_match.group(1).strip()


    desc_div = soup.find('div', class_='listing-desc')
    data['description_full'] = clean_na(desc_div.get_text(separator=' ', strip=True) if desc_div else "N/A")


    products_list = []
    products_legend = None
    for leg in soup.find_all('legend'):
        if 'Products and Services' in leg.text:
            products_legend = leg
            break

    if products_legend:
        parent_div = products_legend.find_parent('div', class_='span6')
        if parent_div:
            thumbnail_list = parent_div.find('ul', class_='thumbnails')
            if thumbnail_list:
                for li in thumbnail_list.find_all('li', class_='span1'):
                    image = li.find('img')
                    if image:
                        products_list.append(urljoin(BASE_URL, image.get('src')))

    data['products_and_services'] = products_list


    data['phone_main'] = clean_na(data['phone_main'])
    data['location'] = clean_na(data['location'])
    data['primary_category'] = clean_na(data['primary_category'])
    data['email'] = clean_na(data['email'])

    return data

async def get_total_pages(session, search_query):
    logger.info(f"Fetching initial page to find total pages for '{search_query}'.")
    url = SEARCH_URL_TEMPLATE.format(query=search_query)
    try:
        async with session.get(url, headers=get_random_headers()) as response:
            response.raise_for_status()
            html_content = await response.text()
            soup = BeautifulSoup(html_content, 'html.parser')
            match = re.search(r'Page \d+ of (\d+)', soup.get_text())
            if match:
                return int(match.group(1))
            end_link = soup.select_one('.pagination-list a[title="End"]')
            if end_link:
                match = re.search(r'page:(\d+)', end_link['href'])
                if match:
                    return int(match.group(1))
            return 1
    except aiohttp.ClientError as e:
        logger.error(f"Error fetching initial search page: {e}")
        return 0

def extract_listing_links(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    links = set()
    results = soup.find('dl', class_='search-results')
    if results:
        for dt in results.find_all('dt', class_='result-title'):
            anchor = dt.find('a')
            if anchor and '/directory/' in anchor.get('href', ''):
                links.add(urljoin(BASE_URL, anchor['href']))
    return list(links)

async def fetch_and_extract_links(session, url, page_num):
    logger.info(f"Extracting links from search page {page_num}...")
    try:
        async with session.get(url, headers=get_random_headers()) as response:
            response.raise_for_status()
            html_content = await response.text()
            return extract_listing_links(html_content)
    except aiohttp.ClientError as e:
        logger.error(f"Error fetching page {page_num}: {e}")
        return []

async def fetch_and_scrape_details(session, url):
    logger.info(f"Scraping details for {url}")
    try:
        async with session.get(url, headers=get_random_headers()) as response:
            response.raise_for_status()
            html_content = await response.text()
            return parse_listing_details(html_content, url)
    except aiohttp.ClientError as e:
        logger.error(f"Error scraping details for {url}: {e}")
        return {"url": url, "error": str(e)}

async def main_scraper(search_query, max_pages_limit=None):
    async with aiohttp.ClientSession() as session:
        dynamic_total_pages = await get_total_pages(session, search_query)
        if dynamic_total_pages == 0:
            logger.info("Could not retrieve search results. Exiting.")
            return []

        effective_page_count = min(dynamic_total_pages, max_pages_limit) if max_pages_limit else dynamic_total_pages
        logger.info(f"Scraping up to page {effective_page_count} of {dynamic_total_pages}.")

        page_urls = []
        for page in range(1, effective_page_count + 1):
            url = SEARCH_URL_TEMPLATE.format(query=search_query) if page == 1 else PAGINATED_URL_TEMPLATE.format(page=page, query=search_query)
            page_urls.append((page, url))

        link_tasks = [fetch_and_extract_links(session, url, page) for page, url in page_urls]
        all_links = set()
        for links_list in await asyncio.gather(*link_tasks):
            all_links.update(links_list)

        logger.info(f"Found {len(all_links)} unique company links.")
        logger.info(f"Scraping {len(all_links)} detail pages...")

        detail_tasks = [fetch_and_scrape_details(session, link) for link in all_links]
        return await asyncio.gather(*detail_tasks)

