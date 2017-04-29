// Copyright 2017 The Rustw Project Developers.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import React from 'react';
import ReactDOM from 'react-dom';
const rustw = require('./rustw');

// FIXME there is a bunch of refactoring that could be done here

// TODO needs testing
class FindResults extends React.Component {
    componentDidMount() {
        $(".src_link").removeClass("src_link");
        highlight_needle(this.props.results, "result");
    }

    render() {
        if (!props.results) {
            return <span className="div_search_no_results">No results found</span>;
        } else {
            const loadLink = (e) => rustw.load_link.call(e.target);
            let results = [];
            let count = 0;
            for (const r of props.results) {
                let lines = [];
                for (const l of r.lines) {
                    const lineLink = r.file_name + ":" + l.line_start;
                    const spanLink = lineLink  + ":" + l.column_start + ":" + l.line_start + ":" + column_end;
                    const lineNumberId = "snippet_line_number_result_" + count + "_" + l.line_start;
                    const lineId = "snippet_line_def_" + count + "_" + l.line_start;
                    lines.push(<span key={l.line_start}>
                                    <span className="div_span_src_number" data-link={lineLink}  onClick={loadLink}>
                                        <div className="span_src_number" id={lineNumberId}>{l.line_start}</div>
                                    </span>
                                    <span className="div_span_src">
                                        <div className="span_src" id={lineId} data-link={spanLink} onClick={loadLink} dangerouslySetInnerHTML={{__html: l.line}} />
                                    </span>
                                    <br />
                               </span>);
                }
                results.push(<div>
                                <div className="div_search_file_link" data-link={r.file_name} key={r.file_name} onClick={loadLink}>{r.file_name}</div>
                                <div className="div_all_span_src">
                                    {lines}
                                </div>
                            </div>);
                count += 1;
            }
            return <div>
                <div className="div_search_title">Search results:</div>
                    <div className="div_search_results">
                        {results}
                    </div>
                </div>;
        }
    }
}

class SearchResults extends React.Component {
    componentDidMount() {
        $(".src_link").removeClass("src_link");
        highlight_needle(this.props.defs, "def");
        highlight_needle(this.props.refs, "ref");
    }

    render() {
        if (!this.props.defs) {
            return <span className="div_search_no_results">No results found</span>;
        } else {
            const loadLink = (e) => rustw.load_link.call(e.target);
            let defs = [];
            let count = 0;
            for (const d of this.props.defs) {
                let lines = [];
                for (const l of d.lines) {
                    const lineLink = d.file_name + ':' + l.line_start;
                    const lineId = "snippet_line_number_def_" + count + "_" + l.line_start;
                    const snippetLink = lineLink + ":" + l.column_start + ":" +  l.line_start + ":" + l.column_end;
                    const snippetId = "snippet_line_def_" + count + "_" + l.line_start;
                    lines.push(<div key={"def-" + lineLink}>
                        <span className="div_span_src_number" data-link={lineLink} onClick={loadLink}>
                            <div className="span_src_number" id={lineId}>{l.line_start}</div>
                        </span>
                        <span className="div_span_src">
                            <div className="span_src" id={snippetId} data-link={snippetLink} onClick={loadLink} dangerouslySetInnerHTML={{__html: l.line}} />
                        </span>
                        <br />
                    </div>);
                }
                defs.push(<div key={"def-" + d.file_name}>
                    <div className="div_search_file_link" data-link={d.file_name} onClick={loadLink}>{d.file_name}</div>
                    <div className="div_all_span_src">
                        {lines}
                    </div>
                </div>);
                count += 1;
            }

            let refs = [];
            count = 0;
            for (const r of this.props.refs) {
                let lines = [];
                for (const l of r.lines) {
                    const lineLink = r.file_name + ':' + l.line_start;
                    const lineId = "snippet_line_number_ref_" + count + "_" + l.line_start;
                    const snippetLink = lineLink + ":" + l.column_start + ":" +  l.line_start + ":" + l.column_end;
                    const snippetId = "snippet_line_ref_" + count + "_" + l.line_start;
                    lines.push(<div key={"ref-" + lineLink}>
                        <span className="div_span_src_number" data-link={lineLink} onClick={loadLink}>
                            <div className="span_src_number" id={lineId}>{l.line_start}</div>
                        </span>
                        <span className="div_span_src">
                            <div className="span_src" id={snippetId} data-link={snippetLink} onClick={loadLink} dangerouslySetInnerHTML={{__html: l.line}} />
                        </span>
                        <br />
                    </div>);
                }
                refs.push(<div key={"ref-" + r.file_name}>
                    <div className="div_search_file_link" data-link={r.file_name} onClick={loadLink}>{r.file_name}</div>
                    <div className="div_all_span_src">
                        {lines}
                    </div>
                </div>);
                count += 1;
            }
            return <div>
                <div className="div_search_title">Definitions:</div>
                <div className="div_search_results">
                    {defs}
                </div>
                <div className="div_search_title">References:</div>
                <div className="div_search_results">
                    {refs}
                </div>
            </div>;
        }
    }
}

function highlight_needle(results, tag) {
    for (const i in results) {
        for (const line of results[i].lines) {
            line.line_end = line.line_start;
            rustw.highlight_spans(line,
                                  null,
                                  "snippet_line_" + tag + "_" + i + "_",
                                  "selected");
        }
    }
}

module.exports = {
    renderFindResults: function(results, container) {
        ReactDOM.render(<FindResults results={results}/>, container);
    },

    renderSearchResults: function(defs, refs, container) {
        ReactDOM.render(<SearchResults defs={defs} refs={refs}/>, container);
    }
}
