import { ParseError } from 'angular2/src/compiler/parse_util';
import { HtmlElementAst, HtmlTextAst, HtmlCommentAst, htmlVisitAll } from 'angular2/src/compiler/html_ast';
import { isPresent, isBlank, StringWrapper } from 'angular2/src/facade/lang';
import { Message } from './message';
export const I18N_ATTR = "i18n";
export const I18N_ATTR_PREFIX = "i18n-";
var CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*"([\s\S]*?)"[\s\S]*\)/g;
/**
 * An i18n error.
 */
export class I18nError extends ParseError {
    constructor(span, msg) {
        super(span, msg);
    }
}
// Man, this is so ugly!
export function partition(nodes, errors) {
    let res = [];
    for (let i = 0; i < nodes.length; ++i) {
        let n = nodes[i];
        let temp = [];
        if (_isOpeningComment(n)) {
            let i18n = n.value.substring(5).trim();
            i++;
            while (!_isClosingComment(nodes[i])) {
                temp.push(nodes[i++]);
                if (i === nodes.length) {
                    errors.push(new I18nError(n.sourceSpan, "Missing closing 'i18n' comment."));
                    break;
                }
            }
            res.push(new Part(null, null, temp, i18n, true));
        }
        else if (n instanceof HtmlElementAst) {
            let i18n = _findI18nAttr(n);
            res.push(new Part(n, null, n.children, isPresent(i18n) ? i18n.value : null, isPresent(i18n)));
        }
        else if (n instanceof HtmlTextAst) {
            res.push(new Part(null, n, null, null, false));
        }
    }
    return res;
}
export class Part {
    constructor(rootElement, rootTextNode, children, i18n, hasI18n) {
        this.rootElement = rootElement;
        this.rootTextNode = rootTextNode;
        this.children = children;
        this.i18n = i18n;
        this.hasI18n = hasI18n;
    }
    get sourceSpan() {
        if (isPresent(this.rootElement))
            return this.rootElement.sourceSpan;
        else if (isPresent(this.rootTextNode))
            return this.rootTextNode.sourceSpan;
        else
            return this.children[0].sourceSpan;
    }
    createMessage(parser) {
        return new Message(stringifyNodes(this.children, parser), meaning(this.i18n), description(this.i18n));
    }
}
function _isOpeningComment(n) {
    return n instanceof HtmlCommentAst && isPresent(n.value) && n.value.startsWith("i18n:");
}
function _isClosingComment(n) {
    return n instanceof HtmlCommentAst && isPresent(n.value) && n.value == "/i18n";
}
function _findI18nAttr(p) {
    let i18n = p.attrs.filter(a => a.name == I18N_ATTR);
    return i18n.length == 0 ? null : i18n[0];
}
export function meaning(i18n) {
    if (isBlank(i18n) || i18n == "")
        return null;
    return i18n.split("|")[0];
}
export function description(i18n) {
    if (isBlank(i18n) || i18n == "")
        return null;
    let parts = i18n.split("|");
    return parts.length > 1 ? parts[1] : null;
}
export function messageFromAttribute(parser, p, attr) {
    let expectedName = attr.name.substring(5);
    let matching = p.attrs.filter(a => a.name == expectedName);
    if (matching.length > 0) {
        let value = removeInterpolation(matching[0].value, matching[0].sourceSpan, parser);
        return new Message(value, meaning(attr.value), description(attr.value));
    }
    else {
        throw new I18nError(p.sourceSpan, `Missing attribute '${expectedName}'.`);
    }
}
export function removeInterpolation(value, source, parser) {
    try {
        let parsed = parser.splitInterpolation(value, source.toString());
        let usedNames = new Map();
        if (isPresent(parsed)) {
            let res = "";
            for (let i = 0; i < parsed.strings.length; ++i) {
                res += parsed.strings[i];
                if (i != parsed.strings.length - 1) {
                    let customPhName = getPhNameFromBinding(parsed.expressions[i], i);
                    customPhName = dedupePhName(usedNames, customPhName);
                    res += `<ph name="${customPhName}"/>`;
                }
            }
            return res;
        }
        else {
            return value;
        }
    }
    catch (e) {
        return value;
    }
}
export function getPhNameFromBinding(input, index) {
    let customPhMatch = StringWrapper.split(input, CUSTOM_PH_EXP);
    return customPhMatch.length > 1 ? customPhMatch[1] : `${index}`;
}
export function dedupePhName(usedNames, name) {
    let duplicateNameCount = usedNames.get(name);
    if (isPresent(duplicateNameCount)) {
        usedNames.set(name, duplicateNameCount + 1);
        return `${name}_${duplicateNameCount}`;
    }
    else {
        usedNames.set(name, 1);
        return name;
    }
}
export function stringifyNodes(nodes, parser) {
    let visitor = new _StringifyVisitor(parser);
    return htmlVisitAll(visitor, nodes).join("");
}
class _StringifyVisitor {
    constructor(_parser) {
        this._parser = _parser;
        this._index = 0;
    }
    visitElement(ast, context) {
        let name = this._index++;
        let children = this._join(htmlVisitAll(this, ast.children), "");
        return `<ph name="e${name}">${children}</ph>`;
    }
    visitAttr(ast, context) { return null; }
    visitText(ast, context) {
        let index = this._index++;
        let noInterpolation = removeInterpolation(ast.value, ast.sourceSpan, this._parser);
        if (noInterpolation != ast.value) {
            return `<ph name="t${index}">${noInterpolation}</ph>`;
        }
        else {
            return ast.value;
        }
    }
    visitComment(ast, context) { return ""; }
    visitExpansion(ast, context) { return null; }
    visitExpansionCase(ast, context) { return null; }
    _join(strs, str) {
        return strs.filter(s => s.length > 0).join(str);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1kQkpHUEY3NC50bXAvYW5ndWxhcjIvc3JjL2kxOG4vc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQWtCLFVBQVUsRUFBQyxNQUFNLGtDQUFrQztPQUNyRSxFQUdMLGNBQWMsRUFFZCxXQUFXLEVBQ1gsY0FBYyxFQUdkLFlBQVksRUFDYixNQUFNLGdDQUFnQztPQUNoQyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDLE1BQU0sMEJBQTBCO09BQ25FLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVztBQUdqQyxPQUFPLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUNoQyxPQUFPLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBQ3hDLElBQUksYUFBYSxHQUFHLHdFQUF3RSxDQUFDO0FBRTdGOztHQUVHO0FBQ0gsK0JBQStCLFVBQVU7SUFDdkMsWUFBWSxJQUFxQixFQUFFLEdBQVc7UUFBSSxNQUFNLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUFDLENBQUM7QUFDdkUsQ0FBQztBQUdELHdCQUF3QjtBQUN4QiwwQkFBMEIsS0FBZ0IsRUFBRSxNQUFvQjtJQUM5RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFFYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksSUFBSSxHQUFvQixDQUFFLENBQUMsS0FBSyxD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RUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsZUFBZSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxjQUFjLEtBQUssS0FBSyxlQUFlLE9BQU8sQ0FBQztRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVuRSxjQUFjLENBQUMsR0FBcUIsRUFBRSxPQUFZLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFekUsa0JBQWtCLENBQUMsR0FBeUIsRUFBRSxPQUFZLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFekUsS0FBSyxDQUFDLElBQWMsRUFBRSxHQUFXO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW4sIFBhcnNlRXJyb3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9wYXJzZV91dGlsJztcbmltcG9ydCB7XG4gIEh0bWxBc3QsXG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sRWxlbWVudEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgSHRtbEV4cGFuc2lvbkFzdCxcbiAgSHRtbEV4cGFuc2lvbkNhc2VBc3QsXG4gIGh0bWxWaXNpdEFsbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvaHRtbF9hc3QnO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmssIFN0cmluZ1dyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZSc7XG5pbXBvcnQge1BhcnNlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcic7XG5cbmV4cG9ydCBjb25zdCBJMThOX0FUVFIgPSBcImkxOG5cIjtcbmV4cG9ydCBjb25zdCBJMThOX0FUVFJfUFJFRklYID0gXCJpMThuLVwiO1xudmFyIENVU1RPTV9QSF9FWFAgPSAvXFwvXFwvW1xcc1xcU10qaTE4bltcXHNcXFNdKlxcKFtcXHNcXFNdKnBoW1xcc1xcU10qPVtcXHNcXFNdKlwiKFtcXHNcXFNdKj8pXCJbXFxzXFxTXSpcXCkvZztcblxuLyoqXG4gKiBBbiBpMThuIGVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgSTE4bkVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU291cmNlU3BhbiwgbXNnOiBzdHJpbmcpIHsgc3VwZXIoc3BhbiwgbXNnKTsgfVxufVxuXG5cbi8vIE1hbiwgdGhpcyBpcyBzbyB1Z2x5IVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbihub2RlczogSHRtbEFzdFtdLCBlcnJvcnM6IFBhcnNlRXJyb3JbXSk6IFBhcnRbXSB7XG4gIGxldCByZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgbGV0IG4gPSBub2Rlc1tpXTtcbiAgICBsZXQgdGVtcCA9IFtdO1xuICAgIGlmIChfaXNPcGVuaW5nQ29tbWVudChuKSkge1xuICAgICAgbGV0IGkxOG4gPSAoPEh0bWxDb21tZW50QXN0Pm4pLnZhbHVlLnN1YnN0cmluZyg1KS50cmltKCk7XG4gICAgICBpKys7XG4gICAgICB3aGlsZSAoIV9pc0Nsb3NpbmdDb21tZW50KG5vZGVzW2ldKSkge1xuICAgICAgICB0ZW1wLnB1c2gobm9kZXNbaSsrXSk7XG4gICAgICAgIGlmIChpID09PSBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG4uc291cmNlU3BhbiwgXCJNaXNzaW5nIGNsb3NpbmcgJ2kxOG4nIGNvbW1lbnQuXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzLnB1c2gobmV3IFBhcnQobnVsbCwgbnVsbCwgdGVtcCwgaTE4biwgdHJ1ZSkpO1xuXG4gICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgSHRtbEVsZW1lbnRBc3QpIHtcbiAgICAgIGxldCBpMThuID0gX2ZpbmRJMThuQXR0cihuKTtcbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG4sIG51bGwsIG4uY2hpbGRyZW4sIGlzUHJlc2VudChpMThuKSA/IGkxOG4udmFsdWUgOiBudWxsLCBpc1ByZXNlbnQoaTE4bikpKTtcbiAgICB9IGVsc2UgaWYgKG4gaW5zdGFuY2VvZiBIdG1sVGV4dEFzdCkge1xuICAgICAgcmVzLnB1c2gobmV3IFBhcnQobnVsbCwgbiwgbnVsbCwgbnVsbCwgZmFsc2UpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY2xhc3MgUGFydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb290RWxlbWVudDogSHRtbEVsZW1lbnRBc3QsIHB1YmxpYyByb290VGV4dE5vZGU6IEh0bWxUZXh0QXN0LFxuICAgICAgICAgICAgICBwdWJsaWMgY2hpbGRyZW46IEh0bWxBc3RbXSwgcHVibGljIGkxOG46IHN0cmluZywgcHVibGljIGhhc0kxOG46IGJvb2xlYW4pIHt9XG5cbiAgZ2V0IHNvdXJjZVNwYW4oKTogUGFyc2VTb3VyY2VTcGFuIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucm9vdEVsZW1lbnQpKVxuICAgICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQuc291cmNlU3BhbjtcbiAgICBlbHNlIGlmIChpc1ByZXNlbnQodGhpcy5yb290VGV4dE5vZGUpKVxuICAgICAgcmV0dXJuIHRoaXMucm9vdFRleHROb2RlLnNvdXJjZVNwYW47XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bMF0uc291cmNlU3BhbjtcbiAgfVxuXG4gIGNyZWF0ZU1lc3NhZ2UocGFyc2VyOiBQYXJzZXIpOiBNZXNzYWdlIHtcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2Uoc3RyaW5naWZ5Tm9kZXModGhpcy5jaGlsZHJlbiwgcGFyc2VyKSwgbWVhbmluZyh0aGlzLmkxOG4pLFxuICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbih0aGlzLmkxOG4pKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaXNPcGVuaW5nQ29tbWVudChuOiBIdG1sQXN0KTogYm9vbGVhbiB7XG4gIHJldHVybiBuIGluc3RhbmNlb2YgSHRtbENvbW1lbnRBc3QgJiYgaXNQcmVzZW50KG4udmFsdWUpICYmIG4udmFsdWUuc3RhcnRzV2l0aChcImkxOG46XCIpO1xufVxuXG5mdW5jdGlvbiBfaXNDbG9zaW5nQ29tbWVudChuOiBIdG1sQXN0KTogYm9vbGVhbiB7XG4gIHJldHVybiBuIGluc3RhbmNlb2YgSHRtbENvbW1lbnRBc3QgJiYgaXNQcmVzZW50KG4udmFsdWUpICYmIG4udmFsdWUgPT0gXCIvaTE4blwiO1xufVxuXG5mdW5jdGlvbiBfZmluZEkxOG5BdHRyKHA6IEh0bWxFbGVtZW50QXN0KTogSHRtbEF0dHJBc3Qge1xuICBsZXQgaTE4biA9IHAuYXR0cnMuZmlsdGVyKGEgPT4gYS5uYW1lID09IEkxOE5fQVRUUik7XG4gIHJldHVybiBpMThuLmxlbmd0aCA9PSAwID8gbnVsbCA6IGkxOG5bMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZWFuaW5nKGkxOG46IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGkxOG4pIHx8IGkxOG4gPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpMThuLnNwbGl0KFwifFwiKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaXB0aW9uKGkxOG46IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGkxOG4pIHx8IGkxOG4gPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGxldCBwYXJ0cyA9IGkxOG4uc3BsaXQoXCJ8XCIpO1xuICByZXR1cm4gcGFydHMubGVuZ3RoID4gMSA/IHBhcnRzWzFdIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VGcm9tQXR0cmlidXRlKHBhcnNlcjogUGFyc2VyLCBwOiBIdG1sRWxlbWVudEFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyOiBIdG1sQXR0ckFzdCk6IE1lc3NhZ2Uge1xuICBsZXQgZXhwZWN0ZWROYW1lID0gYXR0ci5uYW1lLnN1YnN0cmluZyg1KTtcbiAgbGV0IG1hdGNoaW5nID0gcC5hdHRycy5maWx0ZXIoYSA9PiBhLm5hbWUgPT0gZXhwZWN0ZWROYW1lKTtcblxuICBpZiAobWF0Y2hpbmcubGVuZ3RoID4gMCkge1xuICAgIGxldCB2YWx1ZSA9IHJlbW92ZUludGVycG9sYXRpb24obWF0Y2hpbmdbMF0udmFsdWUsIG1hdGNoaW5nWzBdLnNvdXJjZVNwYW4sIHBhcnNlcik7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlKHZhbHVlLCBtZWFuaW5nKGF0dHIudmFsdWUpLCBkZXNjcmlwdGlvbihhdHRyLnZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEkxOG5FcnJvcihwLnNvdXJjZVNwYW4sIGBNaXNzaW5nIGF0dHJpYnV0ZSAnJHtleHBlY3RlZE5hbWV9Jy5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW50ZXJwb2xhdGlvbih2YWx1ZTogc3RyaW5nLCBzb3VyY2U6IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcjogUGFyc2VyKTogc3RyaW5nIHtcbiAgdHJ5IHtcbiAgICBsZXQgcGFyc2VkID0gcGFyc2VyLnNwbGl0SW50ZXJwb2xhdGlvbih2YWx1ZSwgc291cmNlLnRvU3RyaW5nKCkpO1xuICAgIGxldCB1c2VkTmFtZXMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGlmIChpc1ByZXNlbnQocGFyc2VkKSkge1xuICAgICAgbGV0IHJlcyA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlZC5zdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHJlcyArPSBwYXJzZWQuc3RyaW5nc1tpXTtcbiAgICAgICAgaWYgKGkgIT0gcGFyc2VkLnN0cmluZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGxldCBjdXN0b21QaE5hbWUgPSBnZXRQaE5hbWVGcm9tQmluZGluZyhwYXJzZWQuZXhwcmVzc2lvbnNbaV0sIGkpO1xuICAgICAgICAgIGN1c3RvbVBoTmFtZSA9IGRlZHVwZVBoTmFtZSh1c2VkTmFtZXMsIGN1c3RvbVBoTmFtZSk7XG4gICAgICAgICAgcmVzICs9IGA8cGggbmFtZT1cIiR7Y3VzdG9tUGhOYW1lfVwiLz5gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaE5hbWVGcm9tQmluZGluZyhpbnB1dDogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgbGV0IGN1c3RvbVBoTWF0Y2ggPSBTdHJpbmdXcmFwcGVyLnNwbGl0KGlucHV0LCBDVVNUT01fUEhfRVhQKTtcbiAgcmV0dXJuIGN1c3RvbVBoTWF0Y2gubGVuZ3RoID4gMSA/IGN1c3RvbVBoTWF0Y2hbMV0gOiBgJHtpbmRleH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlUGhOYW1lKHVzZWROYW1lczogTWFwPHN0cmluZywgbnVtYmVyPiwgbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGR1cGxpY2F0ZU5hbWVDb3VudCA9IHVzZWROYW1lcy5nZXQobmFtZSk7XG4gIGlmIChpc1ByZXNlbnQoZHVwbGljYXRlTmFtZUNvdW50KSkge1xuICAgIHVzZWROYW1lcy5zZXQobmFtZSwgZHVwbGljYXRlTmFtZUNvdW50ICsgMSk7XG4gICAgcmV0dXJuIGAke25hbWV9XyR7ZHVwbGljYXRlTmFtZUNvdW50fWA7XG4gIH0gZWxzZSB7XG4gICAgdXNlZE5hbWVzLnNldChuYW1lLCAxKTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5Tm9kZXMobm9kZXM6IEh0bWxBc3RbXSwgcGFyc2VyOiBQYXJzZXIpOiBzdHJpbmcge1xuICBsZXQgdmlzaXRvciA9IG5ldyBfU3RyaW5naWZ5VmlzaXRvcihwYXJzZXIpO1xuICByZXR1cm4gaHRtbFZpc2l0QWxsKHZpc2l0b3IsIG5vZGVzKS5qb2luKFwiXCIpO1xufVxuXG5jbGFzcyBfU3RyaW5naWZ5VmlzaXRvciBpbXBsZW1lbnRzIEh0bWxBc3RWaXNpdG9yIHtcbiAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IDA7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcnNlcjogUGFyc2VyKSB7fVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEh0bWxFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGxldCBuYW1lID0gdGhpcy5faW5kZXgrKztcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9qb2luKGh0bWxWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pLCBcIlwiKTtcbiAgICByZXR1cm4gYDxwaCBuYW1lPVwiZSR7bmFtZX1cIj4ke2NoaWxkcmVufTwvcGg+YDtcbiAgfVxuXG4gIHZpc2l0QXR0cihhc3Q6IEh0bWxBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0VGV4dChhc3Q6IEh0bWxUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuX2luZGV4Kys7XG4gICAgbGV0IG5vSW50ZXJwb2xhdGlvbiA9IHJlbW92ZUludGVycG9sYXRpb24oYXN0LnZhbHVlLCBhc3Quc291cmNlU3BhbiwgdGhpcy5fcGFyc2VyKTtcbiAgICBpZiAobm9JbnRlcnBvbGF0aW9uICE9IGFzdC52YWx1ZSkge1xuICAgICAgcmV0dXJuIGA8cGggbmFtZT1cInQke2luZGV4fVwiPiR7bm9JbnRlcnBvbGF0aW9ufTwvcGg+YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFzdC52YWx1ZTtcbiAgICB9XG4gIH1cblxuICB2aXNpdENvbW1lbnQoYXN0OiBIdG1sQ29tbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIFwiXCI7IH1cblxuICB2aXNpdEV4cGFuc2lvbihhc3Q6IEh0bWxFeHBhbnNpb25Bc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGFzdDogSHRtbEV4cGFuc2lvbkNhc2VBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgcHJpdmF0ZSBfam9pbihzdHJzOiBzdHJpbmdbXSwgc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHJzLmZpbHRlcihzID0+IHMubGVuZ3RoID4gMCkuam9pbihzdHIpO1xuICB9XG59XG4iXX0=