export const emptyArray = (n: number) => new Array(n).fill(0);
export const checkIsArray = (arg: any): arg is any[] =>
  Array.isArray(arg) && arg.length > 0;
export const equalArray = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) {
    return false;
  } else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
};
