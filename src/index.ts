import Crypto from './lib/Crypto';
import * as File from './lib/File';

function getFilename(path: string): string {
  return path.substring(path.lastIndexOf('/') + 1);
}

function tips(tip: string) {
  const ele = document.getElementById('tips');
  ele && (ele.innerText = tip);
}

async function handler(content: string, type: 'encode' | 'decode') {
  const bookmarkFile = document.querySelector<HTMLInputElement>('#bookmark-file');
  const passphrase = document.querySelector<HTMLInputElement>('#passphrase');
  if (bookmarkFile && passphrase) {
    if (!bookmarkFile.value) {
      tips('没有输入书签路径！');
      return;
    }
    if (!passphrase.value) {
      tips('没有输入密码短语！');
      return;
    }

    if (type === 'encode') {
      const encodeText = await Crypto.encryptAES(passphrase.value, content, bookmarkFile.value);
      File.downloadTextFile(encodeText, getFilename(bookmarkFile.value), () => {
        tips('编码完成，已导出文件。');
      });
    } else {
      try {
        const decodeText = await Crypto.decryptAES(passphrase.value, content, bookmarkFile.value);
        File.downloadTextFile(decodeText, getFilename(bookmarkFile.value), () => {
          tips('解码完成，已导出文件。');
        });
      } catch (err) {
        console.error(err);
        tips('解码过程中出现错误！');
      }
    }
  } else {
    tips('内部错误！');
  }
}

window.onload = () => {
  let fileContent = '';

  const encodeBtn = document.getElementById('encode');
  const decodeBtn = document.getElementById('decode');
  const selectFile = document.querySelector<HTMLInputElement>('#select-file');

  selectFile?.addEventListener('change', () => {
    File.openTextFile.call(selectFile, (flag, content) => {
      if (flag.state && content) {
        fileContent = content;
      } else {
        tips('文件打开出错！');
      }
    });
  });

  encodeBtn?.addEventListener('click', ev => {
    ev.stopPropagation();
    console.log('encode!');
    handler(fileContent, 'encode');
  });

  decodeBtn?.addEventListener('click', ev => {
    ev.stopPropagation();
    console.log('decode!');
    handler(fileContent, 'decode');
  });
};
