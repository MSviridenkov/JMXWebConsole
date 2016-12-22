'use strict';

export default {
    component: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '20px',
        '@media (max-width: 640px)': {
            width: '100%',
            display: 'block'
        }
    },
    searchBox: {
        padding: '10px 20px 10px 0'
    },
    viewer: {
        base: {
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#282C34',
            border: 'solid 1px black',
            padding: '20px',
            color: '#9DA5AB',
            minHeight: '250px',
            overflow: 'auto',
            maxHeight: '100%'
        }
    },
    treeHeader: {
        display: 'inline-block',
        color: '#9DA5AB',
        verticalAlign: 'middle'
    },
    name:{
        float:'left',
        width:'30%',
        color: '#9DA5AB'
    },
    textField: {
        float:'left',
        width: '60%'
    },
    button: {
        width: '10%',
        height: '30px',
        float: 'left',
        enabled: {
            width: '10%',
            height: '30px',
            color: '#282C34',
            float: 'left'
        }
    },
    compositeButton: {
        width: '100%',
        height: '30px',
        float: 'left',
        enabled: {
            width: '100%',
            float: 'left',
            height: '30px',
            color: '#282C34'
        }
    },
    textFieldArea: {
        width: '100%',
        height: '30px',
        resize: 'none',
        enabled: {
            width: '100%',
            height: '30px',
            resize: 'none',
            color: '#282C34'
        }
    },
    textFieldList: {
        width: '100%',
        padding: '0',
        listStyleType: 'none',
        textAlign: 'left'
    },
    compositeElement: {
        height: '30px'
    },
    compositeTextArea: {
        width: '70%',
        height: '30px',
        float: 'left',
        color: '#282C34'
    },
    tabularData: {
        width: '100%'
    },
    previousButton: {
        width: '50%',
        height: '30px',
        float:'left',
        enabled: {
            width: '50%',
            height: '30px',
            float:'left',
            color: '#282C34'
        }
    },
    nextButton: {
        width: '50%',
        height: '30px',
        float: 'left',
        enabled: {
            width: '50%',
            height: '30px',
            float: 'left',
            color: '#282C34'
        }
    },
    execButton: {
        float:'left',
        width: '10%',
        height: '30px',
        color: '#282C34'
    },
    pollIntervalInput: {
        color: '#000',
        padding: '0 20px 10px 0'
    },
    arrayTextArea: {
        width: '100%',
        height: '30px',
        float: 'left',
        color: '#282C34'
    }
};