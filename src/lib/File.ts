type OpenedTip = 'optionsImportNoFileText' | 'optionsImportNotATextFile' | 'optionsImportCannotFindFile' | 'opened';
type OpenedFlag = {
  state: boolean;
  tip: OpenedTip;
};

/**
 * 读取文本文件的方法
 * @param this
 * @param opened 打开文件的回调函数
 */
export function openTextFile(this: HTMLInputElement, opened: (flag: OpenedFlag, content?: string) => void) {
  if (!this.value) {
    console.warn('No file selected.');
    opened({
      state: false,
      tip: 'optionsImportNoFileText',
    });
    return;
  }

  const file = this.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const { target } = e;
      if (target) {
        const data = target.result;
        if (typeof data === 'string') {
          opened(
            {
              state: true,
              tip: 'opened',
            },
            data
          );
        } else {
          console.warn('Not a text file.');
          opened({
            state: false,
            tip: 'optionsImportNotATextFile',
          });
        }
        return;
      }
    };
    reader.readAsText(file);
  } else {
    console.warn('Cannot find file.');
    opened({
      state: false,
      tip: 'optionsImportCannotFindFile',
    });
    return;
  }
}

/**
 * 下载文本文件至本地的方法
 * @param content 文件内容
 * @param filename 文件名 - 需要带扩展名
 * @param completed 在下载完成后调用的回调函数
 */
export function downloadTextFile(content: string, filename: string, completed?: () => void): void {
  const exportBlob = new Blob([content]);
  const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
  saveLink.href = URL.createObjectURL(exportBlob);
  saveLink.download = filename;

  /** MouseEvent 鼠标事件构造器 */
  const ev = new MouseEvent('click', {
    bubbles: true,
    cancelable: false,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null,
  });
  saveLink.dispatchEvent(ev);

  typeof completed === 'function' && completed();
}
