export function isDuplicated(list: string[]) {
    let duplicate = false;

    list.forEach((value, index) => {
        if (list.indexOf(value) !== index) duplicate = true;
    });

    return duplicate;
}

export function isIncluded(item: string, list: string[]) {
    // add one incase the answer is in index 0
    const index = list.indexOf(item) + 1;
    return index ? true : false;
}
