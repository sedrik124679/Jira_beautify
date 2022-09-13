(() => {

    const state = {
        keysArr: [],
        links: []
    }

    const something = () => {
        const documentsLinks = document.querySelectorAll('a');

        for (link of documentsLinks) {
            const key = parseUrl(link.href);
            if (key) {
                state.links.push(link)
                state.keysArr.push(key)
            }
        }
        console.log([...new Set(state.keysArr)])
        chrome.storage.sync.set({
            'keysArr': JSON.stringify([...new Set(state.keysArr)])
        });
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {

        const { jiraIssues, type } = obj;

        if (type === 'NEW') {
            something()
        }

        state.links.forEach(link => {
            const key = parseUrl(link.href);

            const jiraIssue = jiraIssues.find(item => item.key === key)

            if (!jiraIssue) {
                link.style.textDecoration = 'none'
                link.style.color = 'darkBlue'
                link.innerHTML = noIssues(key)
            }

            const statusFontColor = getStatusColor(jiraIssue.fields?.status.statusCategory.colorName)
            const statusBackgroundColor = getStatusBackgroundColor(jiraIssue.fields?.status.statusCategory.colorName)
            link.style.textDecoration = 'none';
            link.style.color = 'darkBlue';
            link.innerHTML = createCard(jiraIssue?.fields?.issuetype.iconUrl, jiraIssue?.fields?.summary, jiraIssue?.key,
                jiraIssue?.fields?.status.name, statusFontColor, statusBackgroundColor)
        })
        }
    )

    something()
 })()