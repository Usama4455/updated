import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public items: any = [];

  constructor(

  ) {
    this.items = [
      { name: 'Islamabad' },
      { name: 'Lahore' },
      { name: 'Karachi'  },
      { name: 'Multan' },
      { name: 'Peshawar'  },
      { name: 'Faisalabad'  }
    ];
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  fetchFilePathFromURI(URI) {
    const imageRestSource = URI.substring(0, URI.lastIndexOf('/') + 1);
    return imageRestSource;
  }

  fetchFileNameFromURI(URI) {
    const imageName = URI.substring(URI.lastIndexOf('/') + 1);
    return imageName;
  }

}
