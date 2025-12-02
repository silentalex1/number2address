document.addEventListener('DOMContentLoaded', () => {
    const startupDiv = document.getElementById('startup-layer');
    const loginDiv = document.getElementById('login-layer');
    const interfaceDiv = document.getElementById('interface-layer');
    const bgMap = document.getElementById('sat-bg');
    
    const seqDisplay = document.getElementById('sequence-display');
    const acSpan = document.getElementById('target-ac');
    const restSpan = document.getElementById('target-rest');
    const radar = document.getElementById('radar-ui');
    const lockRing = document.getElementById('lock-ring');
    const bootTxt = document.getElementById('boot-text');
    
    const passInput = document.getElementById('access-code');
    const authButton = document.getElementById('auth-btn');
    const deniedMsg = document.getElementById('denied-msg');

    const targetInput = document.getElementById('target-input');
    const searchBtn = document.getElementById('locate-btn');
    const outPanel = document.getElementById('output-panel');
    const cityDisp = document.getElementById('city-display');
    const coordDisp = document.getElementById('coords-display');
    const logCont = document.getElementById('log-container');
    const mapFrame = document.getElementById('map-frame');

    let mapInstance;
    let pinMarker;
    let polyline;

    const nanpDb = {
        '201': [40.79, -74.06, 'Hudson County, NJ'], '202': [38.90, -77.03, 'Washington, D.C.'], '203': [41.30, -72.93, 'Bridgeport, CT'],
        '204': [49.89, -97.13, 'Manitoba, Canada'], '205': [33.52, -86.81, 'Birmingham, AL'], '206': [47.60, -122.33, 'Seattle, WA'],
        '207': [43.66, -70.25, 'Portland, ME'], '208': [43.61, -116.20, 'Boise, ID'], '209': [37.95, -121.29, 'Stockton, CA'],
        '210': [29.42, -98.49, 'San Antonio, TX'], '212': [40.71, -74.00, 'New York, NY'], '213': [34.05, -118.24, 'Los Angeles, CA'],
        '214': [32.77, -96.79, 'Dallas, TX'], '215': [39.95, -75.16, 'Philadelphia, PA'], '216': [41.49, -81.69, 'Cleveland, OH'],
        '217': [39.80, -89.65, 'Springfield, IL'], '218': [46.78, -92.10, 'Duluth, MN'], '219': [41.59, -87.34, 'Hammond, IN'],
        '224': [42.03, -87.88, 'Elgin, IL'], '225': [30.45, -91.18, 'Baton Rouge, LA'], '226': [42.98, -81.24, 'London, ON'],
        '228': [30.36, -89.09, 'Biloxi, MS'], '229': [31.57, -84.15, 'Albany, GA'], '231': [43.23, -86.25, 'Muskegon, MI'],
        '234': [41.08, -81.51, 'Akron, OH'], '239': [26.64, -81.87, 'Cape Coral, FL'], '240': [39.08, -77.15, 'Rockville, MD'],
        '248': [42.55, -83.21, 'Troy, MI'], '250': [48.42, -123.36, 'Victoria, BC'], '251': [30.69, -88.03, 'Mobile, AL'],
        '252': [35.61, -77.37, 'Greenville, NC'], '253': [47.25, -122.44, 'Tacoma, WA'], '254': [31.09, -97.35, 'Killeen, TX'],
        '256': [34.73, -86.58, 'Huntsville, AL'], '260': [41.07, -85.13, 'Fort Wayne, IN'], '262': [43.01, -88.23, 'Kenosha, WI'],
        '267': [40.21, -75.22, 'Southeastern PA'], '269': [42.29, -85.58, 'Kalamazoo, MI'], '270': [37.00, -86.44, 'Bowling Green, KY'],
        '272': [41.40, -75.66, 'Northeastern PA'], '276': [36.69, -81.97, 'Abingdon, VA'], '281': [29.76, -95.36, 'Houston, TX'],
        '289': [43.89, -78.86, 'Oshawa, ON'], '301': [39.41, -77.41, 'Frederick, MD'], '302': [39.15, -75.52, 'Dover, DE'],
        '303': [39.73, -104.99, 'Denver, CO'], '304': [38.34, -81.63, 'Charleston, WV'], '305': [25.76, -80.19, 'Miami, FL'],
        '306': [50.44, -104.61, 'Regina, SK'], '307': [42.86, -106.31, 'Casper, WY'], '308': [40.92, -100.75, 'Grand Island, NE'],
        '309': [40.69, -89.58, 'Peoria, IL'], '310': [33.94, -118.40, 'Beverly Hills, CA'], '312': [41.87, -87.62, 'Chicago, IL'],
        '313': [42.33, -83.04, 'Detroit, MI'], '314': [38.62, -90.19, 'St. Louis, MO'], '315': [43.04, -76.14, 'Syracuse, NY'],
        '316': [37.68, -97.33, 'Wichita, KS'], '317': [39.76, -86.15, 'Indianapolis, IN'], '318': [32.52, -93.75, 'Shreveport, LA'],
        '319': [41.97, -91.66, 'Cedar Rapids, IA'], '320': [45.56, -94.16, 'St. Cloud, MN'], '321': [28.38, -80.60, 'Cape Canaveral, FL'],
        '323': [34.09, -118.32, 'Hollywood, CA'], '325': [32.44, -99.73, 'Abilene, TX'], '330': [41.08, -81.51, 'Youngstown, OH'],
        '331': [41.76, -88.32, 'Aurora, IL'], '334': [32.37, -86.30, 'Montgomery, AL'], '336': [36.07, -79.79, 'Greensboro, NC'],
        '337': [30.22, -92.01, 'Lafayette, LA'], '339': [42.41, -71.10, 'Boston Suburbs, MA'], '346': [29.76, -95.36, 'Houston, TX'],
        '347': [40.72, -73.79, 'Queens, NY'], '351': [42.50, -70.88, 'Essex County, MA'], '352': [29.65, -82.32, 'Gainesville, FL'],
        '360': [46.97, -122.90, 'Olympia, WA'], '361': [27.80, -97.39, 'Corpus Christi, TX'], '364': [37.08, -87.84, 'Western KY'],
        '385': [40.23, -111.65, 'Provo, UT'], '386': [29.21, -81.02, 'Daytona Beach, FL'], '401': [41.82, -71.41, 'Providence, RI'],
        '402': [41.25, -95.99, 'Omaha, NE'], '403': [51.04, -114.07, 'Calgary, AB'], '404': [33.74, -84.38, 'Atlanta, GA'],
        '405': [35.46, -97.51, 'Oklahoma City, OK'], '406': [46.87, -113.99, 'Missoula, MT'], '407': [28.53, -81.37, 'Orlando, FL'],
        '408': [37.33, -121.88, 'San Jose, CA'], '409': [29.29, -94.79, 'Galveston, TX'], '410': [39.29, -76.61, 'Baltimore, MD'],
        '412': [40.44, -79.99, 'Pittsburgh, PA'], '413': [42.10, -72.58, 'Springfield, MA'], '414': [43.03, -87.91, 'Milwaukee, WI'],
        '415': [37.77, -122.41, 'San Francisco, CA'], '416': [43.65, -79.38, 'Toronto, ON'], '417': [37.20, -93.29, 'Springfield, MO'],
        '418': [46.81, -71.20, 'Quebec City, QC'], '419': [41.65, -83.53, 'Toledo, OH'], '423': [35.04, -85.30, 'Chattanooga, TN'],
        '424': [33.83, -118.33, 'Torrance, CA'], '425': [47.61, -122.20, 'Bellevue, WA'], '430': [32.35, -95.30, 'Tyler, TX'],
        '431': [49.89, -97.13, 'Winnipeg, MB'], '432': [31.84, -102.36, 'Odessa, TX'], '434': [37.41, -79.14, 'Lynchburg, VA'],
        '435': [40.64, -111.49, 'Park City, UT'], '437': [43.70, -79.40, 'Toronto, ON'], '438': [45.50, -73.56, 'Montreal, QC'],
        '440': [41.36, -82.10, 'Elyria, OH'], '442': [33.11, -117.29, 'Carlsbad, CA'], '443': [39.29, -76.61, 'Baltimore, MD'],
        '450': [45.54, -73.49, 'Longueuil, QC'], '458': [44.05, -123.08, 'Eugene, OR'], '469': [33.01, -96.69, 'Plano, TX'],
        '470': [33.74, -84.38, 'Atlanta, GA'], '475': [41.30, -72.93, 'New Haven, CT'], '478': [32.84, -83.63, 'Macon, GA'],
        '479': [35.38, -94.39, 'Fort Smith, AR'], '480': [33.41, -111.83, 'Mesa, AZ'], '484': [40.60, -75.47, 'Allentown, PA'],
        '501': [34.74, -92.28, 'Little Rock, AR'], '502': [38.25, -85.75, 'Louisville, KY'], '503': [45.51, -122.67, 'Portland, OR'],
        '504': [29.95, -90.07, 'New Orleans, LA'], '505': [35.68, -105.93, 'Santa Fe, NM'], '506': [45.96, -66.64, 'Fredericton, NB'],
        '507': [44.02, -92.46, 'Rochester, MN'], '508': [42.26, -71.80, 'Worcester, MA'], '509': [47.65, -117.42, 'Spokane, WA'],
        '510': [37.80, -122.27, 'Oakland, CA'], '512': [30.26, -97.74, 'Austin, TX'], '513': [39.10, -84.51, 'Cincinnati, OH'],
        '514': [45.50, -73.56, 'Montreal, QC'], '515': [41.58, -93.61, 'Des Moines, IA'], '516': [40.74, -73.61, 'Nassau County, NY'],
        '517': [42.73, -84.55, 'Lansing, MI'], '518': [42.65, -73.75, 'Albany, NY'], '519': [42.31, -83.03, 'Windsor, ON'],
        '520': [32.22, -110.97, 'Tucson, AZ'], '530': [39.09, -121.17, 'Auburn, CA'], '531': [41.25, -95.99, 'Omaha, NE'],
        '534': [46.52, -91.01, 'Superior, WI'], '539': [36.15, -95.99, 'Tulsa, OK'], '540': [38.30, -77.46, 'Fredericksburg, VA'],
        '541': [42.32, -122.87, 'Medford, OR'], '551': [40.74, -74.03, 'Jersey City, NJ'], '559': [36.73, -119.78, 'Fresno, CA'],
        '561': [26.71, -80.05, 'West Palm Beach, FL'], '562': [33.77, -118.19, 'Long Beach, CA'], '563': [42.49, -90.66, 'Dubuque, IA'],
        '567': [41.65, -83.53, 'Toledo, OH'], '570': [41.24, -75.88, 'Wilkes-Barre, PA'], '571': [38.83, -77.10, 'Arlington, VA'],
        '573': [38.95, -92.33, 'Columbia, MO'], '574': [41.67, -86.25, 'South Bend, IN'], '575': [33.39, -104.52, 'Roswell, NM'],
        '580': [36.39, -97.87, 'Enid, OK'], '581': [46.81, -71.20, 'Quebec, QC'], '585': [43.15, -77.61, 'Rochester, NY'],
        '586': [42.58, -82.87, 'Warren, MI'], '587': [53.54, -113.49, 'Edmonton, AB'], '601': [32.29, -90.18, 'Jackson, MS'],
        '602': [33.44, -112.07, 'Phoenix, AZ'], '603': [43.19, -71.57, 'Concord, NH'], '604': [49.28, -123.12, 'Vancouver, BC'],
        '605': [43.54, -96.72, 'Sioux Falls, SD'], '606': [37.76, -82.51, 'Pikeville, KY'], '607': [42.09, -75.91, 'Binghamton, NY'],
        '608': [43.07, -89.40, 'Madison, WI'], '609': [39.36, -74.42, 'Atlantic City, NJ'], '610': [40.11, -75.34, 'Norristown, PA'],
        '612': [44.97, -93.26, 'Minneapolis, MN'], '613': [45.42, -75.69, 'Ottawa, ON'], '614': [39.96, -82.99, 'Columbus, OH'],
        '615': [36.16, -86.78, 'Nashville, TN'], '616': [42.96, -85.66, 'Grand Rapids, MI'], '617': [42.36, -71.05, 'Boston, MA'],
        '618': [37.72, -89.21, 'Carbondale, IL'], '619': [32.71, -117.16, 'San Diego, CA'], '620': [37.68, -99.89, 'Dodge City, KS'],
        '623': [33.64, -112.26, 'Peoria, AZ'], '626': [34.14, -118.14, 'Pasadena, CA'], '628': [37.77, -122.41, 'San Francisco, CA'],
        '629': [36.16, -86.78, 'Nashville, TN'], '630': [41.75, -88.15, 'Naperville, IL'], '631': [40.82, -73.11, 'Suffolk County, NY'],
        '636': [38.46, -90.71, 'Chesterfield, MO'], '639': [52.13, -106.67, 'Saskatoon, SK'], '641': [41.01, -92.41, 'Ottumwa, IA'],
        '646': [40.71, -74.00, 'New York, NY'], '647': [43.65, -79.38, 'Toronto, ON'], '650': [37.56, -122.32, 'San Mateo, CA'],
        '651': [44.95, -93.08, 'St. Paul, MN'], '657': [33.83, -117.91, 'Anaheim, CA'], '660': [40.19, -92.58, 'Kirksville, MO'],
        '661': [35.37, -119.01, 'Bakersfield, CA'], '662': [33.44, -89.14, 'Starkville, MS'], '667': [39.29, -76.61, 'Baltimore, MD'],
        '669': [37.33, -121.88, 'San Jose, CA'], '670': [15.21, 145.75, 'Saipan, MP'], '671': [13.44, 144.79, 'Hagåtña, Guam'],
        '678': [33.95, -84.54, 'Marietta, GA'], '681': [39.62, -79.95, 'Morgantown, WV'], '682': [32.83, -97.16, 'Hurst, TX'],
        '684': [-14.27, -170.70, 'American Samoa'], '701': [46.80, -100.78, 'Bismarck, ND'], '702': [36.16, -115.13, 'Las Vegas, NV'],
        '703': [38.80, -77.04, 'Alexandria, VA'], '704': [35.22, -80.84, 'Charlotte, NC'], '705': [46.49, -80.99, 'Sudbury, ON'],
        '706': [32.46, -84.98, 'Columbus, GA'], '707': [38.44, -122.71, 'Santa Rosa, CA'], '708': [41.51, -87.84, 'Cicero, IL'],
        '709': [47.56, -52.71, 'St. John\'s, NL'], '712': [42.49, -96.40, 'Sioux City, IA'], '713': [29.76, -95.36, 'Houston, TX'],
        '714': [33.74, -117.86, 'Santa Ana, CA'], '715': [44.95, -89.62, 'Wausau, WI'], '716': [42.88, -78.87, 'Buffalo, NY'],
        '717': [40.03, -76.30, 'Lancaster, PA'], '718': [40.67, -73.94, 'Brooklyn, NY'], '719': [38.83, -104.82, 'Colorado Springs, CO'],
        '720': [39.73, -104.99, 'Denver, CO'], '724': [40.23, -79.33, 'Greensburg, PA'], '725': [36.16, -115.13, 'Las Vegas, NV'],
        '727': [27.96, -82.80, 'Clearwater, FL'], '731': [35.61, -88.81, 'Jackson, TN'], '732': [40.48, -74.44, 'New Brunswick, NJ'],
        '734': [42.28, -83.74, 'Ann Arbor, MI'], '737': [30.26, -97.74, 'Austin, TX'], '740': [39.23, -82.98, 'Chillicothe, OH'],
        '747': [34.18, -118.44, 'Van Nuys, CA'], '754': [26.01, -80.14, 'Hollywood, FL'], '757': [36.85, -76.28, 'Norfolk, VA'],
        '760': [33.68, -116.23, 'Palm Springs, CA'], '762': [33.47, -81.96, 'Augusta, GA'], '763': [45.09, -93.35, 'Maple Grove, MN'],
        '765': [40.41, -86.93, 'Lafayette, IN'], '769': [31.25, -89.25, 'Hattiesburg, MS'], '770': [34.02, -84.36, 'Roswell, GA'],
        '772': [27.18, -80.25, 'Stuart, FL'], '773': [41.97, -87.65, 'Chicago, IL'], '774': [41.70, -71.15, 'Fall River, MA'],
        '775': [39.52, -119.81, 'Reno, NV'], '778': [49.28, -123.12, 'Vancouver, BC'], '779': [42.27, -89.09, 'Rockford, IL'],
        '780': [53.54, -113.49, 'Edmonton, AB'], '781': [42.47, -71.29, 'Waltham, MA'], '785': [39.04, -95.67, 'Topeka, KS'],
        '786': [25.76, -80.19, 'Miami, FL'], '787': [18.46, -66.10, 'San Juan, PR'], '801': [40.76, -111.89, 'Salt Lake City, UT'],
        '802': [44.47, -73.21, 'Burlington, VT'], '803': [34.00, -81.03, 'Columbia, SC'], '804': [37.54, -77.44, 'Richmond, VA'],
        '805': [34.28, -119.29, 'Ventura, CA'], '806': [33.58, -101.85, 'Lubbock, TX'], '808': [21.30, -157.85, 'Honolulu, HI'],
        '810': [43.01, -83.68, 'Flint, MI'], '812': [39.16, -86.52, 'Bloomington, IN'], '813': [27.95, -82.45, 'Tampa, FL'],
        '814': [40.51, -78.39, 'Altoona, PA'], '815': [42.27, -89.09, 'Rockford, IL'], '816': [39.09, -94.57, 'Kansas City, MO'],
        '817': [32.75, -97.33, 'Fort Worth, TX'], '818': [34.18, -118.44, 'San Fernando Valley, CA'], '819': [45.42, -75.70, 'Gatineau, QC'],
        '828': [35.59, -82.55, 'Asheville, NC'], '830': [29.70, -98.12, 'New Braunfels, TX'], '831': [36.97, -122.03, 'Santa Cruz, CA'],
        '832': [29.76, -95.36, 'Houston, TX'], '835': [40.61, -75.37, 'Bethlehem, PA'], '843': [32.77, -79.93, 'Charleston, SC'],
        '845': [41.14, -74.04, 'New City, NY'], '847': [42.03, -87.88, 'Skokie, IL'], '848': [40.05, -74.20, 'Lakewood, NJ'],
        '850': [30.43, -84.28, 'Tallahassee, FL'], '856': [39.92, -75.11, 'Cherry Hill, NJ'], '857': [42.36, -71.05, 'Boston, MA'],
        '858': [32.83, -117.27, 'La Jolla, CA'], '859': [38.04, -84.50, 'Lexington, KY'], '860': [41.76, -72.67, 'Hartford, CT'],
        '862': [40.73, -74.17, 'Newark, NJ'], '863': [28.03, -81.94, 'Lakeland, FL'], '864': [34.94, -81.93, 'Spartanburg, SC'],
        '865': [35.96, -83.92, 'Knoxville, TN'], '867': [62.45, -114.37, 'Yellowknife, NT'], '870': [34.22, -92.01, 'Pine Bluff, AR'],
        '872': [41.87, -87.62, 'Chicago, IL'], '878': [40.44, -79.99, 'Pittsburgh, PA'], '901': [35.14, -90.04, 'Memphis, TN'],
        '902': [44.64, -63.57, 'Halifax, NS'], '903': [33.42, -94.04, 'Texarkana, TX'], '904': [30.33, -81.65, 'Jacksonville, FL'],
        '905': [43.15, -79.24, 'Niagara Falls, ON'], '906': [46.54, -87.39, 'Marquette, MI'], '907': [64.83, -147.71, 'Fairbanks, AK'],
        '908': [40.66, -74.21, 'Elizabeth, NJ'], '909': [34.10, -117.29, 'San Bernardino, CA'], '910': [34.22, -77.94, 'Wilmington, NC'],
        '912': [32.08, -81.09, 'Savannah, GA'], '913': [38.88, -94.81, 'Olathe, KS'], '914': [40.91, -73.78, 'New Rochelle, NY'],
        '915': [31.76, -106.48, 'El Paso, TX'], '916': [38.58, -121.49, 'Sacramento, CA'], '917': [40.71, -74.00, 'New York, NY'],
        '918': [35.91, -95.37, 'Muskogee, OK'], '919': [35.77, -78.63, 'Raleigh, NC'], '920': [44.51, -88.01, 'Green Bay, WI'],
        '925': [37.90, -122.06, 'Walnut Creek, CA'], '928': [32.69, -114.62, 'Yuma, AZ'], '929': [40.71, -74.00, 'New York, NY'],
        '931': [36.53, -87.35, 'Clarksville, TN'], '934': [40.78, -73.26, 'Long Island, NY'], '936': [30.71, -95.55, 'Huntsville, TX'],
        '937': [39.75, -84.19, 'Dayton, OH'], '938': [34.73, -86.58, 'Huntsville, AL'], '939': [18.22, -66.59, 'Puerto Rico'],
        '940': [33.91, -98.49, 'Wichita Falls, TX'], '941': [27.33, -82.53, 'Sarasota, FL'], '947': [42.55, -83.21, 'Troy, MI'],
        '949': [33.68, -117.79, 'Irvine, CA'], '951': [33.95, -117.39, 'Riverside, CA'], '952': [44.79, -93.35, 'Bloomington, MN'],
        '954': [26.12, -80.14, 'Fort Lauderdale, FL'], '956': [25.90, -97.49, 'Brownsville, TX'], '959': [41.76, -72.67, 'Hartford, CT'],
        '970': [40.58, -105.08, 'Fort Collins, CO'], '971': [45.51, -122.67, 'Portland, OR'], '972': [33.15, -96.82, 'Frisco, TX'],
        '973': [40.91, -74.17, 'Paterson, NJ'], '978': [42.63, -71.31, 'Lowell, MA'], '979': [29.28, -94.81, 'Galveston, TX'],
        '980': [35.22, -80.84, 'Charlotte, NC'], '984': [35.77, -78.63, 'Raleigh, NC'], '985': [30.27, -89.77, 'Slidell, LA'],
        '989': [43.61, -84.77, 'Mt. Pleasant, MI']
    };

    const intlDb = {
        '93': [34.55, 69.20, 'Kabul, Afghanistan'], '355': [41.32, 19.81, 'Tirana, Albania'], '213': [36.75, 3.04, 'Algiers, Algeria'],
        '54': [-34.60, -58.38, 'Buenos Aires, Argentina'], '374': [40.18, 44.51, 'Yerevan, Armenia'], '61': [-33.86, 151.20, 'Sydney, Australia'],
        '43': [48.20, 16.37, 'Vienna, Austria'], '994': [40.40, 49.86, 'Baku, Azerbaijan'], '973': [26.22, 50.58, 'Manama, Bahrain'],
        '880': [23.81, 90.41, 'Dhaka, Bangladesh'], '375': [53.90, 27.56, 'Minsk, Belarus'], '32': [50.85, 4.35, 'Brussels, Belgium'],
        '501': [17.49, -88.19, 'Belize City, Belize'], '591': [-16.50, -68.11, 'La Paz, Bolivia'], '387': [43.85, 18.41, 'Sarajevo, Bosnia'],
        '55': [-23.55, -46.63, 'Sao Paulo, Brazil'], '359': [42.69, 23.32, 'Sofia, Bulgaria'], '855': [11.55, 104.92, 'Phnom Penh, Cambodia'],
        '237': [3.84, 11.50, 'Yaounde, Cameroon'], '56': [-33.44, -70.66, 'Santiago, Chile'], '86': [39.90, 116.40, 'Beijing, China'],
        '57': [4.71, -74.07, 'Bogota, Colombia'], '506': [9.92, -84.09, 'San Jose, Costa Rica'], '385': [45.81, 15.98, 'Zagreb, Croatia'],
        '53': [23.11, -82.36, 'Havana, Cuba'], '357': [35.18, 33.38, 'Nicosia, Cyprus'], '420': [50.07, 14.43, 'Prague, Czechia'],
        '45': [55.67, 12.56, 'Copenhagen, Denmark'], '20': [30.04, 31.23, 'Cairo, Egypt'], '503': [13.69, -89.21, 'San Salvador, El Salvador'],
        '372': [59.43, 24.75, 'Tallinn, Estonia'], '251': [9.00, 38.74, 'Addis Ababa, Ethiopia'], '358': [60.16, 24.93, 'Helsinki, Finland'],
        '33': [48.85, 2.35, 'Paris, France'], '995': [41.71, 44.82, 'Tbilisi, Georgia'], '49': [52.52, 13.40, 'Berlin, Germany'],
        '233': [5.60, -0.18, 'Accra, Ghana'], '30': [37.98, 23.72, 'Athens, Greece'], '502': [14.63, -90.50, 'Guatemala City, Guatemala'],
        '509': [18.59, -72.30, 'Port-au-Prince, Haiti'], '504': [14.07, -87.20, 'Tegucigalpa, Honduras'], '852': [22.31, 114.16, 'Hong Kong'],
        '36': [47.49, 19.04, 'Budapest, Hungary'], '354': [64.14, -21.89, 'Reykjavik, Iceland'], '91': [19.07, 72.87, 'Mumbai, India'],
        '62': [-6.20, 106.84, 'Jakarta, Indonesia'], '98': [35.68, 51.38, 'Tehran, Iran'], '964': [33.31, 44.36, 'Baghdad, Iraq'],
        '353': [53.34, -6.26, 'Dublin, Ireland'], '972': [31.76, 35.21, 'Jerusalem, Israel'], '39': [41.90, 12.49, 'Rome, Italy'],
        '1876': [18.01, -76.80, 'Kingston, Jamaica'], '81': [35.67, 139.65, 'Tokyo, Japan'], '962': [31.94, 35.92, 'Amman, Jordan'],
        '254': [-1.29, 36.82, 'Nairobi, Kenya'], '965': [29.37, 47.97, 'Kuwait City, Kuwait'], '371': [56.94, 24.10, 'Riga, Latvia'],
        '961': [33.89, 35.50, 'Beirut, Lebanon'], '218': [32.88, 13.19, 'Tripoli, Libya'], '370': [54.68, 25.27, 'Vilnius, Lithuania'],
        '352': [49.61, 6.13, 'Luxembourg'], '60': [3.13, 101.68, 'Kuala Lumpur, Malaysia'], '356': [35.89, 14.51, 'Valletta, Malta'],
        '52': [19.43, -99.13, 'Mexico City, Mexico'], '377': [43.73, 7.42, 'Monaco'], '976': [47.90, 106.90, 'Ulaanbaatar, Mongolia'],
        '212': [33.57, -7.58, 'Casablanca, Morocco'], '95': [16.86, 96.19, 'Yangon, Myanmar'], '977': [27.71, 85.32, 'Kathmandu, Nepal'],
        '31': [52.36, 4.90, 'Amsterdam, Netherlands'], '64': [-36.84, 174.76, 'Auckland, New Zealand'], '505': [12.11, -86.23, 'Managua, Nicaragua'],
        '234': [9.07, 7.39, 'Abuja, Nigeria'], '850': [39.03, 125.76, 'Pyongyang, North Korea'], '47': [59.91, 10.75, 'Oslo, Norway'],
        '92': [24.86, 67.00, 'Karachi, Pakistan'], '507': [8.98, -79.51, 'Panama City, Panama'], '51': [-12.04, -77.04, 'Lima, Peru'],
        '63': [14.59, 120.98, 'Manila, Philippines'], '48': [52.22, 21.01, 'Warsaw, Poland'], '351': [38.72, -9.13, 'Lisbon, Portugal'],
        '974': [25.28, 51.53, 'Doha, Qatar'], '40': [44.42, 26.10, 'Bucharest, Romania'], '7': [55.75, 37.61, 'Moscow, Russia'],
        '966': [24.71, 46.67, 'Riyadh, Saudi Arabia'], '381': [44.78, 20.44, 'Belgrade, Serbia'], '65': [1.35, 103.81, 'Singapore'],
        '421': [48.14, 17.10, 'Bratislava, Slovakia'], '386': [46.05, 14.50, 'Ljubljana, Slovenia'], '27': [-26.20, 28.04, 'Johannesburg, South Africa'],
        '82': [37.56, 126.97, 'Seoul, South Korea'], '34': [40.41, -3.70, 'Madrid, Spain'], '94': [6.92, 79.86, 'Colombo, Sri Lanka'],
        '46': [59.32, 18.06, 'Stockholm, Sweden'], '41': [47.37, 8.54, 'Zurich, Switzerland'], '886': [25.03, 121.56, 'Taipei, Taiwan'],
        '66': [13.75, 100.50, 'Bangkok, Thailand'], '216': [36.80, 10.18, 'Tunis, Tunisia'], '90': [41.00, 28.97, 'Istanbul, Turkey'],
        '380': [50.45, 30.52, 'Kyiv, Ukraine'], '971': [25.20, 55.27, 'Dubai, UAE'], '44': [51.50, -0.12, 'London, UK'],
        '598': [-34.90, -56.16, 'Montevideo, Uruguay'], '998': [41.29, 69.24, 'Tashkent, Uzbekistan'], '58': [10.48, -66.90, 'Caracas, Venezuela'],
        '84': [21.02, 105.83, 'Hanoi, Vietnam'], '967': [15.36, 44.19, 'Sanaa, Yemen'], '260': [-15.38, 28.32, 'Lusaka, Zambia'],
        '263': [-17.82, 31.05, 'Harare, Zimbabwe']
    };

    setTimeout(() => {
        acSpan.textContent = '312';
        restSpan.textContent = '-555-0199';
        seqDisplay.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
        seqDisplay.style.opacity = '1';

        setTimeout(() => {
            bootTxt.textContent = "ESTABLISHING UPLINK...";
            acSpan.classList.add('code-fly');
            restSpan.classList.add('rest-fade');
            
            setTimeout(() => {
                bgMap.style.transformOrigin = '28% 35%';
                bgMap.classList.add('map-zoom-fx');
                radar.style.opacity = '1';

                setTimeout(() => {
                    lockRing.classList.add('target-locked');
                    bootTxt.classList.add('text-red-500');
                    bootTxt.textContent = "TARGET ACQUIRED";

                    setTimeout(() => {
                        startupDiv.style.opacity = '0';
                        setTimeout(() => {
                            startupDiv.style.display = 'none';
                            loginDiv.style.display = 'flex';
                            requestAnimationFrame(() => {
                                loginDiv.style.opacity = '1';
                            });
                        }, 1000);
                    }, 1800);
                }, 1500);
            }, 800);
        }, 1500);
    }, 500);

    function attemptLogin() {
        if (passInput.value === 'free2access$$') {
            loginDiv.style.opacity = '0';
            setTimeout(() => {
                loginDiv.style.display = 'none';
                interfaceDiv.classList.remove('pointer-events-none', 'opacity-0');
                interfaceDiv.classList.add('fade-in-ui');
                initMap();
                setTimeout(() => {
                    mapFrame.style.opacity = '0.7';
                }, 800);
            }, 1000);
        } else {
            deniedMsg.style.opacity = '1';
            passInput.value = '';
            setTimeout(() => deniedMsg.style.opacity = '0', 2000);
        }
    }

    authButton.addEventListener('click', attemptLogin);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    function initMap() {
        mapInstance = L.map('map-frame', {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            zoomAnimation: true,
            fadeAnimation: true,
            markerZoomAnimation: true
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(mapInstance);
    }

    function getHistory() {
        const history = [];
        const statuses = ['DISCONNECTED', 'BURNER', 'ENCRYPTED', 'ROAMING', 'VOIP', 'STATIC'];
        for(let i=0; i<4; i++) {
            const rAc = Math.floor(Math.random() * 800) + 200;
            const rPre = Math.floor(Math.random() * 900) + 100;
            const rSuf = Math.floor(Math.random() * 9000) + 1000;
            const stat = statuses[Math.floor(Math.random() * statuses.length)];
            history.push({num: `(${rAc}) ${rPre}-${rSuf}`, status: stat});
        }
        return history;
    }

    function getRandomOffset() {
        return (Math.random() - 0.5) * 0.08;
    }

    searchBtn.addEventListener('click', () => {
        const rawVal = targetInput.value.trim();
        const cleanVal = rawVal.replace(/\D/g, '');
        
        if (cleanVal.length < 3) {
            alert("ERROR: INSUFFICIENT DATA SEGMENTS");
            return;
        }

        let found = null;
        let isIntl = false;

        if (rawVal.startsWith('+') || rawVal.startsWith('00')) {
            let prefix = cleanVal.substring(0, 3);
            if (intlDb[prefix]) found = {lat: intlDb[prefix][0], lng: intlDb[prefix][1], n: intlDb[prefix][2]};
            else {
                prefix = cleanVal.substring(0, 2);
                if (intlDb[prefix]) found = {lat: intlDb[prefix][0], lng: intlDb[prefix][1], n: intlDb[prefix][2]};
                else {
                    prefix = cleanVal.substring(0, 1);
                    if (intlDb[prefix]) found = {lat: intlDb[prefix][0], lng: intlDb[prefix][1], n: intlDb[prefix][2]};
                }
            }
            if(found) isIntl = true;
        } 
        
        if (!found) {
            let ac = cleanVal.substring(0, 3);
            if (cleanVal.length > 10 && cleanVal.startsWith('1')) {
                ac = cleanVal.substring(1, 4);
            }
            
            if (nanpDb[ac]) {
                found = {lat: nanpDb[ac][0], lng: nanpDb[ac][1], n: nanpDb[ac][2]};
            }
        }

        if (!found) {
            found = {lat: 25 + Math.random() * 10, lng: -40 + Math.random() * 10, n: 'Signal Relay: Encrypted Node'};
            isIntl = true;
        }

        const finalLat = found.lat + getRandomOffset();
        const finalLng = found.lng + getRandomOffset();

        const zLevel = isIntl ? 10 : 14;

        mapInstance.flyTo([finalLat, finalLng], zLevel, {
            animate: true,
            duration: 4,
            easeLinearity: 0.2
        });

        if (pinMarker) mapInstance.removeLayer(pinMarker);

        setTimeout(() => {
            const iconHTML = L.divIcon({
                className: 'custom-pin',
                html: '<div class="pin-pulse"></div>'
            });
            
            pinMarker = L.marker([finalLat, finalLng], {icon: iconHTML}).addTo(mapInstance);

            outPanel.classList.remove('hidden');
            outPanel.classList.remove('slide-up');
            void outPanel.offsetWidth;
            outPanel.classList.add('slide-up');

            cityDisp.textContent = found.n;
            coordDisp.textContent = `LAT: ${finalLat.toFixed(6)} // LNG: ${finalLng.toFixed(6)}`;

            const histData = getHistory();
            logCont.innerHTML = histData.map(item => `
                <div class="flex justify-between items-center bg-green-900/10 p-3 border-b border-green-900/30 hover:bg-green-900/20 transition-colors">
                    <span class="text-[10px] text-green-400 font-mono tracking-wider">${item.num}</span>
                    <span class="text-[8px] text-red-400 border border-red-900/50 px-2 py-0.5 bg-red-900/10 rounded">${item.status}</span>
                </div>
            `).join('');
            
        }, 3800);
    });
});
