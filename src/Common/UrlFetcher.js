
const PROD = 'prod';
const LOCAL = 'local';
const env = PROD;
// const env = 'local';

const getStockHistoryUrl = (stockName, period, page) => {
    if (env === PROD) {
        return ' https://6tzw64t9eb.execute-api.us-east-1.amazonaws.com/default/getStockHistory?stockName=' + stockName +
        '&period=' + period + '&page=' + page;
    } else if (env === LOCAL) {
        return 'http://localhost:8080/prediction/' + stockname + '/' + period + '/' + page;
    }
}
const getPerformanceUrl = (period, numPicks, page) => {
    if (env === PROD) {
    return 'https://o4f1k8x2fb.execute-api.us-east-1.amazonaws.com/default/getPerformance?period=' + period +
        '&numPicks=' + numPicks + '&page=' + page;
    } else if (env === LOCAL) {
        return 'http://localhost:8080/performance/' + period + '/' + numPicks + '/' + page;
    }
}

const getStockDateUrl = (stockName, date) => {
    if (env === PROD) {
        return 'https://wn5oloaa27.execute-api.us-east-1.amazonaws.com/default/getStockDate?stockName=' + stockName +
            '&date=' + date;
    } else if (env === LOCAL) {
        return 'http://localhost:8080/prediction/stock/' + stockName + '/' + date;
    }
}

const getStockDetailsUrl = (stockName) => {
    if (env === PROD) {
        return ' https://mcgnbffws5.execute-api.us-east-1.amazonaws.com/default/getStockDetails?stockName=' + stockName;
    } else if (env === LOCAL) {
        return 'http://localhost:8080/stock-details/' + stockName;
    }
}

const getStockTableUrl = (period, date, searchString, page) => {
    if (env === PROD) {
        return  'https://9hvq4fznse.execute-api.us-east-1.amazonaws.com/default/getStockList?period=' + period +
        '&date=' + (!!date ? date : '0') +
        '&searchString=' + searchString +
        '&page=' + page;
    } else if (env === LOCAL) {
        return 'http://localhost:8080/prediction/all/' + period + '/' + date + '/' + searchString + '/' + page;
    }
}

export default UrlFetcher;