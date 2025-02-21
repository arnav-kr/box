<img width="256" src="https://github.com/user-attachments/assets/b2e8ab04-1b31-4958-b8f7-ac030f5b90c3" alt="The Box"/>

## Welcome to **The Box**!
A place where you can create and solve boxes.

boxes can be any type of challenge, puzzle, or riddle. You make a box and the community tries to solve it.

<a href="https://box.arnv.dev">
<table>
  <th>Open the Box</th>
</table>
</a>

## Usage:
```txt
Base URL: box.arnv.dev

GET / - View Help Message
GET /boxes - get a list of boxes
GET /box/:id - get a box by id

POST /create - create a new box
    Content-Type: application/json
    data: {
      name: string, min 3, max 50
      content: string, max 200
      solution: string, max 200
      difficulty?: number, 1-5
      tags?: array of strings, each tag length min 3, max 20
    }
POST /box/:id/solve - solve a box by id
    Content-Type: application/json
    data: {
      solution: string, max 200
    }
```
## Quick Tips: 
- Use [ggl.link/jsonformatter](https://ggl.link/jsonformatter) to easily work with JSON data in Browser
- Use [curl](https://curl.se/) or other tools to interact with the API from terminal

## Author
[Arnav Kumar](https://github.com/arnav-kr)

Happy Box-ing! (lol)🎉
