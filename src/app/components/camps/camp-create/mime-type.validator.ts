import { AbstractControl } from '@angular/forms';
import { Observable, of, Observer } from 'rxjs';

//(Asynchronous)validator will just a function , so export it to be used by component.
// file reader is an asynchronous function here , because parsing a file takes longer time.So it
//will be a arrow function.
//null is valid file type else it will return a error code.

export const mimeType = (
  control: AbstractControl
  //promise and observer will be returned of type any. here [key:string] is basically a way to assign a dynamic property
  //name which can have any name and type will be string. later in the code it is named as invalidMimeType.

): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  if (typeof (control.value) === 'string') {
    return of(null);
  }
  //extract the file.
  const file = control.value as File;
  //use file reader to read the file.
  const fileReader = new FileReader();
  //we need to send a observable , so JS allow us to create a observable and takes a function as parameter.


  const frObs = Observable.create(
    //function as parameter.
    //observer here is a tool to control when this observable emits data.type will be same as the type
    //of observable our function will return.
    (observer: Observer<{ [key: string]: any }>) => {
      //loadend is
      fileReader.addEventListener('loadend', () => {
        // we are using Uint8Array because here we will just not check the file extension
        //instead , we will check the type of data in that file to confirm it is a image file.
        //subarray 0,4 will give us the mime type. (refer Uint8Array for more details).
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);

        //we need to pull out some info from that array.
        let header = '';
        let isValid = false;
        //string of hexadecimal value. and it clearly defines pattern for file.
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        //end of switch

        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();

      });

      fileReader.readAsArrayBuffer(file);
    }
  );
  //console.log(frObs)
  return frObs;
};
