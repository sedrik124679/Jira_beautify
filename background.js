chrome.runtime.onInstalled.addListener(async () => {
    const keys = await fetchDataFromStorage('keysArr')
    console.log(keys)

    // const activeTab = await getActiveTabURL();

    const issuesInfo = await getIssueByKey(keys)

    chrome.tabs.onUpdated.addListener((tabId, tab) => {
        chrome.tabs.sendMessage(tabId, {
            type: 'NEW',
            jiraIssues: issuesInfo,
        });
    });
});

const fetchDataFromStorage = (param) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get([param], (obj) => {
            resolve(obj[param] ? JSON.parse(obj[param]) : []);
        });
    });
};

const getIssueByKey = async (keyArr) => {
    const result = []

    keyArr.forEach(key => {
        fetch(`https://sedrik124679.atlassian.net/rest/api/3/issue/${key}`)
            .then((res) => res.json())
            .then(issue => result.push(issue))
    })

    return result
}

// async function getActiveTabURL() {
//     const tabs = await chrome.tabs.query({
//         currentWindow: true,
//         active: true
//     });
//
//     return tabs[0];
// }