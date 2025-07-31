function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const dataURI = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    chrome.downloads.download({
        url: dataURI,
        filename: filename,
        conflictAction: 'uniquify',
        saveAs: true
    });
}


function parseUrl(urlToDecode) {
    const parsedUrl = new URL(urlToDecode);
    const searchParams = new URLSearchParams(parsedUrl.search);
    const mapBounds = searchParams.get('searchQueryState');
    const mapBoundsJson = JSON.parse(mapBounds);
    const mapBoundsCoordinates = mapBoundsJson.mapBounds;
    return mapBoundsCoordinates;
}





function get_data(zillow_url) {
    const mapBoundsCoordinates = parseUrl(zillow_url);
    fetchData(mapBoundsCoordinates);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url) {
        get_data(message.url);
    }
});



const cookies = {
    '_px3': '632b52f61250ae9130e8a3d3f03392c3907f07dbb496851dad85ac2b0647e105:QZ+6XkWPd5WRhmUY3ZNvvzoUp/rgSVSGzQqafNwAsJ21Oku+N7NXvzag14ofHArEGqVqlNaARqehry9W3+Lflg==:1000:/+6asw6/39g/zHOyYGRaNHczgjDlnkSU5sqbGxPtNFgTdsj+cVHX+dR0kWL6/bU9D0fgG72dvjCEvb73AFpctVHk+q5nQqH80U3DUxh71gJAcR2eR5pUr8olEv9o7CTcq+UveJ+EvYKYs5zAUxG4SntVwE3Vmcf7gmfRre6C1cFJ+gVp1vi8qjfFfhrCRcgCJXMX0FzavVYnU+dq8xvD05QbY0iZvqUtJ54xlvDXOGo='
};

const headers = {
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'content-type': 'application/json',
    'origin': 'https://www.zillow.com',
    'referer': 'https://www.zillow.com/',
    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
}


const specific_keys = [
    "zpid", "id", "rawHomeStatusCd", "marketingStatusSimplifiedCd", "imgSrc",
    "hasImage", "detailUrl", "statusType", "statusText", "countryCurrency",
    "price", "unformattedPrice", "address", "addressStreet", "addressCity",
    "addressState", "addressZipcode", "isUndisclosedAddress", "beds", "baths",
    "area", "latitude", "longitude", "isZillowOwned", "type", "text",
    "latitude", "longitude", "isZillowOwned", "type", "text", "zpid",
    "streetAddress", "zipcode", "city", "state", "latitude", "longitude",
    "price", "bathrooms", "bedrooms", "livingArea", "homeType", "homeStatus",
    "daysOnZillow", "isFeatured", "shouldHighlight", "zestimate", "rentZestimate",
    "isNonOwnerOccupied", "isPremierBuilder", "isZillowOwned", "currency",
    "country", "taxAssessedValue", "lotAreaValue", "lotAreaUnit",
    "isShowcaseListing", "isSaved", "isUserClaimingOwner", "isUserConfirmedClaim",
    "pgapt", "sgapt", "zestimate", "shouldShowZestimateAsPrice", "has3DModel",
    "hasVideo", "isHomeRec", "hasAdditionalAttributions", "isFeaturedListing",
    "isShowcaseListing", "list", "relaxed"
];



async function fetchData(map_bounds_coordinates) {
    let filteredItems = []; // Array to hold filtered items

    for (let page_num = 1; page_num <= 21; page_num++) {
        let json_data = {
            'searchQueryState': {
                'pagination': {
                    'currentPage': page_num,
                },
                'isMapVisible': false,
                'mapBounds': map_bounds_coordinates,
                'filterState': {
                    'sortSelection': {
                        'value': 'globalrelevanceex',
                    },
                    'isAllHomes': {
                        'value': true,
                    },
                },
                'isListVisible': true,
            },
            'wants': {
                'cat1': [
                    'listResults',
                ],
                'cat2': [
                    'total',
                ],
            },
            'requestId': 5,
            'isDebugRequest': false,
        };

        const response = await fetch('https://www.zillow.com/async-create-search-page-state', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(json_data),
            cookies: cookies
        });

        if (response.ok) {
            const data = await response.json();
            const list_results = data.cat1?.searchResults?.listResults || [];
            const orderedUniqueKeys = [...new Set(specific_keys)];
            list_results.forEach(item => {
                const filtered_item = {};
                orderedUniqueKeys.forEach(key => {
                    if (item[key] !== undefined) {
                        filtered_item[key] = item[key];
                    } else if (item.hdpData?.homeInfo?.[key] !== undefined) {
                        filtered_item[key] = item.hdpData.homeInfo[key];
                    }
                });
                filteredItems.push(filtered_item); // Add filtered item to array
            });
        }
    }

    const orderedUniqueKeys = [...new Set(specific_keys)];
    const csv = convertArrayOfObjectsToCSV(filteredItems, orderedUniqueKeys);
    downloadCSV(csv, 'zillow_data.csv');
}

function convertArrayOfObjectsToCSV(data, columnKeys) {
    if (!data || !data.length) {
        return '';
    }

    const escapeCsvField = (field) => {
        if (field === null || field === undefined) {
            return '';
        }
        const stringField = String(field);
        // If the field contains a comma, a double quote, or a newline, it needs to be quoted.
        if (/[",\n]/.test(stringField)) {
            // Escape any double quotes by doubling them, then wrap the whole field in double quotes.
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };

    const header = columnKeys.map(key => escapeCsvField(key)).join(',');
    const rows = data.map(item =>
        columnKeys.map(key => escapeCsvField(item[key])).join(',')
    );

    return [header, ...rows].join('\n');
}
