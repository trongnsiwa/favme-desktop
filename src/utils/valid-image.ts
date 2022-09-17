export const testImage = (url: string, timeout?: number) =>
  new Promise((res) => {
    timeout = timeout || 5000;
    let timedOut = false;
    let timer: string | number | NodeJS.Timeout = 0;
    const img = new Image();

    img.onerror = img.onabort = function () {
      if (!timedOut) {
        clearTimeout(timer);
        res("error");
      }
    };

    img.onload = function () {
      if (!timedOut) {
        clearTimeout(timer);
        res("success");
      }
    };

    img.src = url;

    timer = setTimeout(function () {
      timedOut = true;
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = "//!!!!/test.jpg";
      res("timeout");
    }, timeout);
  });
