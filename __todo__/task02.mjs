#! /usr/bin/env zx

const goSit = async ()=>{
    // 清空当前内容
    await $`clear`

    // 代码赞成
    await $`git stash`
    
    // 查看分支
    await $`git branch`

    // 切换分支
    await $`git checkout feature/dev-test`

    // 拉去代码
    // await $`git pull`

    // 打印日志
    await $`git log`
}

goSit()