let arr = ["src/**/orderManager/**/*.{vue,js,jsx}","src/**/logisticsManager/**/*.{vue,js,jsx}","src/**/bill*/**/*.{vue,js,jsx}","!src/**/orderManager/orderList/goodsDialog.vue"]
let str = ''
arr.forEach(item=>{
    str += '"'+item+'",'
})
console.log("'["+str.slice(0,-1)+"]'");
