import React, { Component } from "react";
import "./videoDescription.css";
// import CKEditor from "ckeditor4-react"
import { UncontrolledTooltip } from "reactstrap";

////////////////

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "react-bootstrap/Button";
import IconButton from "@material-ui/core/IconButton";

import {
  Fullscreen,
  FullscreenExit,
  Print,
  Redo,
  Undo,
  ZoomIn,
  ZoomOut,
  ArrowDropDown,
  ArrowDropUp,
  Search,
  Close,
} from "@material-ui/icons";

import Quill from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//import "react-quill/dist/quill.bubble.css"
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import { pdfExporter } from "quill-to-pdf";
import * as quillToWord from "quill-to-word";
import screenfull from "screenfull";
import { ImageResize } from "quill-image-resize-module";
import katex from "katex";
import "katex/dist/katex.min.css";
import { saveAs } from "file-saver";

import ColorPicker from "../../ColorPicker";

const Size = Quill.import("attributors/style/size");
const Font = Quill.import("attributors/style/font");

Size.whitelist = [
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "36px",
  "48px",
  "72px",
];

Quill.register(Size, true);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
Quill.register(Font, true);
Quill.register("modules/imageResize", ImageResize);
Font.whitelist = ["inconsolata", "roboto", "mirza", "arial"];
window.katex = katex;

//////////////////

class Description extends Component {
  constructor(props) {
    super(props);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; //
    this.quill = "";

    this.quillModules = {
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: false,
      },
      toolbar: {
        container: "#toolbar",
        handlers: {
          symbol: (value) => {
            if (value) {
              const cursorPosition = this.quill.getSelection().index;
              this.quill.insertText(cursorPosition, value);
              this.quill.setSelection(cursorPosition + value.length);
            }
          },
          maximize: () => {
            if (document.fullscreenEnabled) {
              screenfull.toggle(
                document.querySelector(".devTextContainer-player")
              );
              this.setState({
                fullscreenEnabled: !this.state.fullscreenEnabled,
              });
            } else {
              console.log("Screenfull not enabled");
            }
          },

          zoomIn: () => {
            console.log(this.quill);
            const { fontSizeIndx } = this.state;
            if (fontSizeIndx < Size.whitelist.length - 1) {
              this.quill.formatText(0, this.quill.getText().length, {
                size: Size.whitelist[this.state.fontSizeIndx + 1],
              });
              this.setState({ fontSizeIndx: this.state.fontSizeIndx + 1 });
            }
          },
          zoomOut: () => {
            const { fontSizeIndx } = this.state;
            if (fontSizeIndx > 0) {
              this.quill.formatText(0, this.quill.getText().length, {
                size: Size.whitelist[this.state.fontSizeIndx - 1],
              });
              this.setState({ fontSizeIndx: this.state.fontSizeIndx - 1 });
            }
          },
          undo: () => {
            return this.quill.history.undo();
          },

          redo: () => {
            return this.quill.history.redo();
          },
          print: () => {
            this.setState({ openPrintDialog: true });
            //  this.saveToPdf()
          },
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
        displaySize: true,
      },
      imageDropAndPaste: {},

      keyboard: {
        bindings: {
          shift_enter: {
            key: 13,
            shiftKey: true,
            handler: (range, ctx) => {
              this.quill.insertText(range.index, "\n");
            },
          },
          enter: {
            key: 13,
            handler: (range) => {
              if (this.props.notesShow)
                this.quill.insertText(range.index, "\n");
            },
          },
        },
      },
    };
    this.quillFormats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "font",
      "list",
      "script",
      "direction",
      "align",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "formula",
      "color",
      "background",
      "size",
    ];
    this.state = {
      fullscreenEnabled: false,
      //open: false,
      //openPrintDialog: false,
      printNotesMode: false,
      searchMode: false,
      fontSizeIndx: 5,
      cursorPosition: "",
      cursorIndices: [],
      selectedRadioBtn: "1",
      editor: "",
      searchText: "",
      searchArr: [],
      searchIndex: 0,
    };
  }
  async componentDidMount() {
    // this.quillRef = null // Quill instance
    // this.reactQuillRef = null //
    // this.quill = ""
    // this.quill.formatText(0, this.quill.getText().length, {
    //   size: Size.whitelist[this.state.fontSizeIndx],
    // })
    this.quill = this.reactQuillRef ? this.reactQuillRef.getEditor() : "";
  }
  handleRadioBtnChange = (e) => {
    this.setState({ selectedRadioBtn: e.target.value });
  };
  handleChange = (value, delta, source, editor) => {
    if (!editor) {
      return;
    }
    if (!this.quill) this.quill = editor;

    if (this.state.searchMode) this.setState({ searchText: value });
    else this.props.handleOnChange(value);

    if (editor.getSelection())
      this.setState({
        cursorPosition: editor.getSelection().index,
        cursorIndices: [
          ...this.state.cursorIndices,
          editor.getSelection().index,
        ],
      });
  };

  quillToolbar = () => {
    console.log(
      this.props.KeywordsShow,
      this.props.transcriptShow,
      this.props.notesShow,
      this.props.isH5p
    );
    const { searchMode } = this.state;

    if (document.querySelector(".ql-container.ql-snow"))
      document.querySelector(".ql-container.ql-snow").style.height = this.props
        .notesShow
        ? "315px"
        : "370px";
    if (
      (!this.props.notesShow && !this.props.transcriptShow) ||
      this.props.isH5p
    )
      return null;
    return (
      <div id="toolbar">
        <div id="editingToolbar">
          <button
            className="ql-bold"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <button
            className="ql-italic"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <button
            className="ql-underline"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <button
            className="ql-strike"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <select
            className="ql-color"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <select
            className="ql-background"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />
          <button
            className="ql-clean"
            style={{ display: this.props.notesShow ? "" : "none" }}
          />{" "}
          <button className="ql-bc">
            {" "}
            <ColorPicker />
          </button>
          <div
            style={{
              display: this.props.notesShow ? "" : "none",
              marginRight: "10px",
            }}
          >
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
            <button className="ql-script" value="sub"></button>
            <button className="ql-script" value="super"></button>

            <button
              className="ql-undo"
              style={{ display: this.props.notesShow ? "" : "none" }}
            >
              <Undo />
            </button>
            <button
              className="ql-redo"
              style={{ display: this.props.notesShow ? "" : "none" }}
            >
              <Redo />
            </button>

            <select className="ql-header" defaultValue="">
              <option value="">Normal</option>

              <option value="1">Header 1</option>
              <option value="2">Header 2</option>
              <option value="3">Header 3</option>
              <option value="4">Header 4</option>
              <option value="5">Header 5</option>
              <option value="6">Header 6</option>
            </select>
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-indent" value="+1"></button>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align" />

            <select className="ql-font" defaultValue="aref-ruqaa">
              <option value="arial">Arial</option>
              <option value="comic-sans">Comic Sans</option>
              <option value="courier-new">Courier New</option>
              <option value="georgia">Georgia</option>
              <option value="helvetica">Helvetica</option>
              <option value="lucida">Lucida</option>
              <option value="aref-ruqaa" selected>
                Aref Ruqaa
              </option>
              <option value="mirza">Mirza</option>
              <option value="roboto">Roboto</option>
              <option value="inconsolata">Inconsolata</option>
              <option value="roboto">Roboto</option>
            </select>
            <select className="ql-size">
              <option value="10px">10</option>
              <option value="11px">11</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px" selected>
                16
              </option>
              <option value="18px">18</option>
              <option value="20px">20</option>
              <option value="22px">22</option>
              <option value="24px">24</option>
              <option value="26px">26</option>
              <option value="28px">28</option>
              <option value="36px">36</option>
              <option value="48px">48</option>
              <option value="72px">72</option>
            </select>
            <button className="ql-image" />
            <button className="ql-video" />
            <button className="ql-link" />
            <button className="ql-formula" />

            <select className="ql-symbol" style={{ textAlign: "center" }}>
              <option value="α">α</option>
              <option value="β">β</option>
              <option value="π">π</option>
              <option value="ꭥ">ꭥ</option>
              <option value="ω">ω</option>
              <option value="τ">τ</option>
              <option value="θ">θ</option>
              <option value="δ">δ</option>
            </select>
          </div>
          {/* <Tooltip title="increase font size">*/}
          <button className="ql-zoomIn" style={{ height: "auto" }}>
            <ZoomIn />
          </button>
          {/*</Tooltip>*/}
          {/*<Tooltip title="decrease font size">*/}
          <button className="ql-zoomOut" style={{ height: "auto" }}>
            <ZoomOut />
          </button>
          {/*</Tooltip>*/}
        </div>
        <button className="ql-maximize" style={{ height: "auto" }}>
          {this.state.fullscreenEnabled ? <FullscreenExit /> : <Fullscreen />}
        </button>

        {/*<Tooltip title="Print Text">*/}
        <button
          className="ql-print"
          style={{
            padding: "initial",
            marginLeft: "15px",
            marginTop: "2px",
            display: this.props.notesShow ? "" : "none",
          }}
        >
          <Print />
        </button>
        {/*</Tooltip>*/}

        {/* <div className="ql-search-div" style={{ float: "right" }}>
          <Search style={{ color: "grey" }} />

          <input
            className="ql-search"
            id="editor-search"
            type="text"
            autocomplete="off"
            style={{ textAlign: this.state.lang === "ar" ? "right" : "left" }}
            // onKeyDown={this.onSerachBarKeyDown}
            // onChange={this.searchText}
            placeholder="search in text..."
          />
          <div
            style={{
              float: "right",
              //, writingMode: "vertical-lr"
            }}
          >
            <button className="ql-search_previous" disabled={!searchMode}>
              {" "}
              <ArrowDropUp />
            </button>
            <button className="ql-search_next" disabled={!searchMode}>
              <ArrowDropDown />
            </button>
          </div>
          <div />
          <audio
            id="audio"
            src=""
            controls="controls"
            loop={this.state.isMusic}
            style={{ width: "250px", height: "30px", display: "none" }}
          />
        </div>
          */}
      </div>
    );
  };
  printNotes = async () => {
    this.setState({ openPrintDialog: false, printNotesMode: false });
    //    document.getElementById("cover-spin").style.display = ""
    const { selectedRadioBtn } = this.state;
    const fileName = this.props.topicTitle; //.replace(/ /g, "_")

    if (selectedRadioBtn === "1") {
      const pdfAsBlob = await pdfExporter.generatePdf(this.quill.getContents());
      saveAs(pdfAsBlob, `${fileName}.pdf`);
    } else if (selectedRadioBtn === "2") {
      const docAsBlob = await quillToWord.generateWord(
        this.quill.getContents(),
        {
          exportAs: "blob",
        }
      );

      saveAs(docAsBlob, `${fileName}.docx`);
    }

    // document.getElementById("cover-spin").style.display = "none"
  };
  render() {
    return (
      <>
        <div
          className={
            this.props.IsMediaFile
              ? "border border-info divStyle-Mo"
              : "border border-info divStyle"
          }
        >
          <div className="devTextContainer-player">
            <div className="title">
              {<p id="title-p">{this.props.title}</p>}
            </div>

            {this.quillToolbar()}
            {this.props.notesShow && !this.props.isH5p ? (
              <div id="notes" className="div-text">
                <ReactQuill
                  theme="snow"
                  ref={(el) => {
                    this.reactQuillRef = el;
                  }}
                  //                  readOnly={false}
                  value={
                    this.state.searchMode
                      ? this.state.searchText
                      : this.props.studentNotes
                  }
                  onChange={this.handleChange}
                  placeholder="Start typing here..."
                  modules={this.quillModules}
                  formats={this.quillFormats}
                />
              </div>
            ) : this.props.transcriptShow && !this.props.isH5p ? (
              <div id="transcript" className="div-text">
                <ReactQuill
                  theme="snow"
                  ref={(el) => {
                    this.reactQuillRef = el;
                  }}
                  readOnly={false}
                  value={
                    this.state.searchMode
                      ? this.state.searchText
                      : this.props.currentSummary.replace(/\r?\n/g, "<br />")
                  }
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  onChange={this.handleChange}
                  placeholder="Start typing here..."
                  modules={this.quillModules}
                  formats={this.quillFormats}
                />
              </div>
            ) : this.props.KeywordsShow && !this.props.isH5p ? (
              <div
                id="keywords"
                style={{ height: "inherit", overflowY: "auto" }}
              >
                <p>
                  {this.props.keywords.map((item) => {
                    return (
                      <div key={item.id}>
                        <span>
                          <span
                            style={{
                              textDecoration: "underline",
                              color: "black",
                            }}
                            href="#"
                            id={item.id}
                          >
                            {item.word} :
                          </span>
                          <UncontrolledTooltip
                            placement="right"
                            target={item.id}
                          >
                            {item.definition}
                          </UncontrolledTooltip>
                          <b> </b>
                        </span>

                        <span className="youtubeLink">
                          <a
                            href={item.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            youTube{" "}
                          </a>
                        </span>
                        <span className="wikipediaLink">
                          <a
                            href={item.wikipediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            wikipedia
                          </a>
                        </span>

                        <span className="wikipediaLink">
                          <a
                            href={item.ekbLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            ekb
                          </a>
                        </span>
                      </div>
                    );
                  })}
                </p>
              </div>
            ) : null}
          </div>

          <div className="btns-container">
            <select
              className="btn btn-info"
              style={{ margin: "2px 2px", fontSize: "14px", width: "20%" }}
              onClick={(e) => {
                if (e.detail === 0 || e.detail !== 0)
                  this.props.onSummaryClick(e.target.value);
              }}
            >
              <option value="full_transcript">Transcript 100%</option>
              <option value="Summary_50">Summary 50%</option>
              <option value="Summary_25">Summary 25%</option>
            </select>

            <button
              className="btn btn-info"
              style={{
                width: "20%",
              }}
              onClick={() => {
                this.props.updateKeywordsCount();
                this.props.onKeywordsClick();
              }}
            >
              Keywords
            </button>

            <button
              className="btn btn-info"
              onClick={() => {
                this.props.updateNotesCount();
                this.props.onNotesClick();
              }}
            >
              Notes
            </button>

            <select
              className="btn btn-info"
              id="langSelect"
              style={{ margin: "2px 2px", fontSize: "14px", width: "20%" }}
              onChange={(e) => {
                this.props.onTranslationClick(e.target.value);
              }}
              //defaultValue={""}
            >
              <option value="" disabled>
                Language
              </option>

              {this.props.availableLanguage &&
              this.props.availableLanguage.length > 0
                ? this.props.availableLanguage.map((item) => (
                    <option value={item.lang}>{item.text}</option>
                  ))
                : null}

              {/* <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="eg">Academic</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="es">Spanish</option> */}
            </select>

            <button
              style={{ width: "20%" }}
              className="btn btn-info"
              disabled={!this.props.notesShow}
              onClick={() => {
                this.props.saveNotes();
              }}
            >
              Save
            </button>
          </div>
        </div>
        <Dialog
          id="print-dialog"
          open={this.state.openPrintDialog}
          onClose={() => {
            this.setState({ openPrintDialog: false });
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            <IconButton
              style={{ float: "right" }}
              aria-label="close"
              onClick={() => {
                this.setState({ openPrintDialog: false });
              }}
            >
              <Close />
            </IconButton>
            <h2>Select Print Format</h2>
          </DialogTitle>
          <DialogContent>
            <RadioGroup
              defaultValue="first"
              aria-label="gender"
              name="customized-radios"
            >
              <FormControlLabel
                control={
                  <Radio
                    disableRipple
                    checked={this.state.selectedRadioBtn === "1"}
                    value={1}
                    onChange={this.handleRadioBtnChange}
                  />
                }
                label={<h4>PDF</h4>}
              />
              <FormControlLabel
                value="second"
                control={
                  <Radio
                    disableRipple
                    value={2}
                    checked={this.state.selectedRadioBtn === "2"}
                    onChange={this.handleRadioBtnChange}
                  />
                }
                label={<h4>Word Document</h4>}
              />
            </RadioGroup>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ openPrintDialog: false });
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={this.printNotes} color="primary">
              Print
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Description;
