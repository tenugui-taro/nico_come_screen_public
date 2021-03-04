export default class CommentModel {
  id: string;
  color: string;
  text: string;
  posY: string;

  constructor(id: string, color: string, text: string, posY: string) {
    this.id = id;
    this.color = color;
    this.text = text;
    this.posY = posY;
  }
}
