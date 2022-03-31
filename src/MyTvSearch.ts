import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import e from "express";


export class MyTvSearch extends LitElement {
  @property({ type: String }) title = 'My app';

  @property() shows: any = [];
  @property() selectedShow: any = {};
  @property()
  showName: string = 'Flash';
  @property() toggleDetail: boolean = false;
  @property() selectedShowId: number = 0;


  static styles = css`
    :host {
      font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
      //min-height: 100vh;
      //display: flex;
      //flex-direction: column;
      //align-items: center;
      //justify-content: flex-start;
      //font-size: calc(10px + 2vmin);
      //color: #1a2b42;
      //max-width: 960px;
      //margin: 0 auto;
      //text-align: center;
      //background-color: var(--my-tv-search-background-color);
    }

    main {
      flex-grow: 1;
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      height: 193px;
    }

    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      cursor: default;
    }

    .imageShow {
      float: left;
      padding: 5px;
    }

    .container {
      flex-direction: row;
    }

    .icon {
      padding-left: 25px;
      background: url(/src/assets/searchIcon.png) no-repeat left;
      background-size: 20px;
      border-radius: 10px;
    }

    .column {
      float: left;
      width: 45%;
      padding: 10px;
    }

    .row:after {
      content: "";
      display: table;
      clear: both;
    }

    .card-container {
      padding: 5px 5px;
    }

    .btn-large {
      width:auto;
      height:32px;
      background-color: cornflowerblue;
      border-radius: 8px;
    }
  `;

  render() {
    return html`
      <main>
        <div class="form">
          <div style="border: 1px solid #DDD;">
            <input @input=${this.getShowName} @keyup="${this.fetchShows}" placeholder="What you want to watch" class="icon" >
          </div>
        </div>


        <div class="container">
          <div class="row" ?hidden=${this.toggleDetail}>
            <!-- TODO: Render list items. -->
            ${this.shows.map((show: any) =>
              html`
                <div class="column">
                  <div class="card">
                      <img src="${show.show.image.medium}" alt="Show Image" height="182" class="imageShow">
                    <div class="card-container">
                      <ul style="list-style-type: none">
                        <li><button class="btn-large" @click=${() => this.tvDetail(show.show.id)} style="cursor:pointer;">${show.title}</button></li>
                        <li>${show.rating}</li>
                        <li>
                          <div style="padding: 10px 15px">
                            ${show.description}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>`
            )}
          </div>
          <div ?hidden=${!this.toggleDetail} >
            <button @click=${() => this.toggleDetail = false} style="cursor:pointer;">Return to Search</button>
            <div class="detailColumn" style="width: 100%">
                  <div class="detailCard">
                      <img src="${this.selectedShow.image}" alt="${this.selectedShow.name} Image" class="imageShow">
                    <div class="detailCardContainer">
                        <h2>${this.selectedShow.name}</h2>
                        <h4>Current Rating: ${this.selectedShow.currentRating}</h4>
                          <div style="padding: 10px 15px">
                            ${this.selectedShow.description}
                          </div>
                      </ul>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </main>
    `;
  }

  getShowName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showName = input.value;

  }

  async fetchShows(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${this.showName}`);
        const data = await response.json();
        data.forEach((d: any) => {
          d.title = d.show.name;
          d.description = d.show.summary ? d.show.summary.substring(0, 245).replace(/<[^>]+>/g, '') : 'No description';
          d.description += d.show.summary ? '...' : '';
          d.rating = d.show.rating.average ? d.show.rating.average : 'No rating yet';
        });

        this.shows = data;
        console.log(this.shows)
      } catch (e) {
        console.log(e);
      }
    }

  }

  async tvDetail(showId: number) {
    if (showId != 0) {
      this.selectedShowId = showId;
      this.toggleDetail = true;
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${this.selectedShowId}`);
        const data = await response.json();
        console.log(data);
        data.description = data.summary ? data.summary.replace(/<[^>]+>/g, '') : 'No description';
        data.image = data.image ? data.image.medium : '';
        data.currentRating = data.rating.average;
        this.selectedShow = data;

      } catch (e) {
        console.log(e);
      }
    }
  }
}
