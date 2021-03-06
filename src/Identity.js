"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = require("tweetnacl");
var proto_1 = require("./proto");
var DataPeps_1 = require("./DataPeps");
var Error_1 = require("./Error");
var CryptoFuncs_1 = require("./CryptoFuncs");
var Tools_1 = require("./Tools");
var IdentityImpl = /** @class */ (function () {
    function IdentityImpl(session) {
        this.session = session;
    }
    IdentityImpl.prototype.get = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "GET", code: 200,
                            path: "/api/v4/identity/" + encodeURI(login),
                            response: function (r) { return IdentityX.fromTypes(proto_1.types.Identity.decode(r)); },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.create = function (identity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var osharingGroup, encryption, publicKeys, sharingGroup, epub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = options == null ? {} : options;
                        osharingGroup = options.sharingGroup == null ? [] : options.sharingGroup;
                        encryption = new CryptoFuncs_1.Encryption();
                        encryption.generate(Tools_1.Uint8Tool.convert(options.secret), this.session.encryption);
                        return [4 /*yield*/, this.session.getLatestPublicKeys(osharingGroup)];
                    case 1:
                        publicKeys = _a.sent();
                        sharingGroup = publicKeys.map(function (_a) {
                            var login = _a.login, version = _a.version, box = _a.box, sign = _a.sign;
                            var kind = proto_1.types.IdentityShareKind.SHARING;
                            var _b = encryption.encryptKey(kind, _this.session.encryption, box), message = _b.message, nonce = _b.nonce;
                            return {
                                login: login, version: version, nonce: nonce, kind: kind,
                                encryptedKey: message
                            };
                        });
                        epub = encryption.getPublic();
                        return [4 /*yield*/, this.session.doProtoRequest({
                                method: "POST", code: 201,
                                path: "/api/v4/identity",
                                request: function () { return proto_1.types.IdentityCreateRequest.encode({
                                    identity: identity, sharingGroup: sharingGroup, encryption: encryption,
                                    signChain: _this.session.encryption.sign(Tools_1.Uint8Tool.concat(epub.boxEncrypted.publicKey, epub.signEncrypted.publicKey)),
                                }).finish(); },
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.update = function (identity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "PUT", code: 200,
                            path: "/api/v4/identity/" + encodeURI(identity.login),
                            request: function () { return proto_1.types.IdentityFields.encode(identity).finish(); },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.list = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "GET", code: 200,
                            path: "/api/v4/identities/list",
                            params: options,
                            response: function (r) {
                                var identities = proto_1.types.IdentityListResponse.decode(r).identities;
                                return identities.map(IdentityX.fromTypes);
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.getSharingGroup = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "GET", code: 200,
                            path: "/api/v4/identity/" + encodeURIComponent(login) + "/sharingGroup",
                            response: function (r) { return proto_1.types.IdentityGetSharingGroupResponse.decode(r).sharingGroup; }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.getAccessGroup = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "GET", code: 200,
                            path: "/api/v4/identity/" + encodeURIComponent(login) + "/accessGroup",
                            response: function (r) { return proto_1.types.IdentityGetAccessGroupResponse.decode(r).accessGroup; }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.renewKeys = function (login, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var kind, assume, _a, encryption, creator, sharingGroup, key, next, epub, _b, message, nonce, backward;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        kind = proto_1.types.IdentityShareKind.SHARING;
                        assume = { login: login, kind: DataPeps_1.IdentityAccessKind.WRITE };
                        return [4 /*yield*/, this.session.doProtoRequest({
                                method: "GET", code: 200,
                                path: "/api/v4/identity/" + encodeURIComponent(login) + "/keysToRenew",
                                response: proto_1.types.IdentityGetKeysToRenewResponse.decode,
                                assume: assume,
                            })];
                    case 1:
                        _a = _c.sent(), encryption = _a.encryption, creator = _a.creator, sharingGroup = _a.sharingGroup;
                        return [4 /*yield*/, this.session.getAssumeParams({
                                login: login, kind: DataPeps_1.IdentityAccessKind.WRITE,
                            })
                            // Generate a fresh encryption
                        ];
                    case 2:
                        key = (_c.sent()).key;
                        next = new CryptoFuncs_1.Encryption();
                        if (secret == null) {
                            next.generateWithMasterPublicKey(encryption.masterPublicKey, encryption.masterSalt, this.session.encryption);
                        }
                        else {
                            next.generate(Tools_1.Uint8Tool.convert(secret), this.session.encryption);
                        }
                        next.version = key.version + 1;
                        epub = next.getPublic();
                        _b = this.session.encryption.encrypt(proto_1.types.ResourceType.SES).encrypt(epub.boxEncrypted.publicKey, key.sharingKey), message = _b.message, nonce = _b.nonce;
                        backward = { nonce: nonce, encryptedKey: message };
                        return [4 /*yield*/, this.session.doProtoRequest({
                                method: "POST", code: 201,
                                path: "/api/v4/identity/" + encodeURIComponent(login) + "/keysToRenew",
                                request: function () { return proto_1.types.IdentityPostKeysToRenewRequest.encode({
                                    encryption: epub, backward: backward,
                                    signChain: nacl.sign.detached(Tools_1.Uint8Tool.concat(epub.boxEncrypted.publicKey, epub.signEncrypted.publicKey), key.signKey),
                                    sharingGroup: sharingGroup.map(function (_a) {
                                        var login = _a.login, version = _a.version, box = _a.box, sign = _a.sign;
                                        var _b = next.encryptKey(kind, _this.session.encryption, box), message = _b.message, nonce = _b.nonce;
                                        return {
                                            login: login, version: version, encryptedKey: message, nonce: nonce, kind: kind
                                        };
                                    })
                                }).finish(); },
                                assume: assume,
                            })];
                    case 3:
                        _c.sent();
                        this.session.clearAssumeParams(login);
                        return [2 /*return*/];
                }
            });
        });
    };
    IdentityImpl.prototype.extendSharingGroup = function (login, sharingGroup) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var key, publicKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.session.clearAssumeParams(login);
                        return [4 /*yield*/, this.session.getAssumeParams({ login: login, kind: DataPeps_1.IdentityAccessKind.WRITE })];
                    case 1:
                        key = (_a.sent()).key;
                        return [4 /*yield*/, this.session.getLatestPublicKeys(sharingGroup)];
                    case 2:
                        publicKeys = _a.sent();
                        return [4 /*yield*/, this.session.doProtoRequest({
                                method: "PATCH", code: 201,
                                path: "/api/v4/identity/" + encodeURI(login) + "/sharingGroup",
                                assume: { login: login, kind: DataPeps_1.IdentityAccessKind.WRITE },
                                request: function () { return proto_1.types.IdentityShareRequest.encode({
                                    version: key.version,
                                    sharingGroup: publicKeys.map(function (_a) {
                                        var login = _a.login, version = _a.version, box = _a.box, sign = _a.sign;
                                        var kind = proto_1.types.IdentityShareKind.SHARING;
                                        var _b = _this.session.encryption.encrypt(proto_1.types.ResourceType.SES).encrypt(box, key.sharingKey), message = _b.message, nonce = _b.nonce;
                                        return {
                                            login: login, version: version, nonce: nonce, kind: kind,
                                            encryptedKey: message
                                        };
                                    }),
                                }).finish(); },
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.replaceSharingGroup = function (login, sharingGroup) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var kind, graph, _a, newBoxPublicKeys, encryptedGraph;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        kind = proto_1.types.IdentityShareKind.SHARING;
                        return [4 /*yield*/, this.getSharingGraph(login)];
                    case 1:
                        graph = _b.sent();
                        if (graph[0].login != login) {
                            throw new Error_1.Error({
                                kind: Error_1.SDKKind.SDKInternalError,
                                payload: { login: login, graph: graph, hint: "unexpected graph" }
                            });
                        }
                        // Replace the sharing group of login
                        _a = graph[0];
                        return [4 /*yield*/, this.session.getLatestPublicKeys(sharingGroup)
                            // Filter only latest identites
                        ];
                    case 2:
                        // Replace the sharing group of login
                        _a.sharingGroup = _b.sent();
                        // Filter only latest identites
                        graph = graph.filter(function (elt) { return elt.latest; });
                        newBoxPublicKeys = new Map();
                        encryptedGraph = graph.map(function (elt) {
                            var encryption = new CryptoFuncs_1.Encryption();
                            encryption.generateWithMasterPublicKey(elt.masterPublicKey, null, _this.session.encryption);
                            encryption.version = elt.version + 1;
                            newBoxPublicKeys.set(elt.login, {
                                login: login, sign: null,
                                box: encryption.getPublicKey(proto_1.types.IdentityShareKind.BOX),
                                version: encryption.version,
                            });
                            return { elt: elt, encryption: encryption };
                        }).map(function (_a) {
                            var elt = _a.elt, encryption = _a.encryption;
                            var epub = encryption.getPublic();
                            var _b = _this.session.encryption.encrypt(proto_1.types.ResourceType.SES).encrypt(epub.boxEncrypted.publicKey, elt.sharingKey), message = _b.message, nonce = _b.nonce;
                            var backward = { nonce: nonce, encryptedKey: message };
                            return {
                                login: elt.login,
                                version: elt.version + 1,
                                sharingEncrypted: epub.sharingEncrypted,
                                boxEncrypted: epub.boxEncrypted,
                                signEncrypted: epub.signEncrypted,
                                readEncrypted: epub.readEncrypted,
                                signChain: nacl.sign.detached(Tools_1.Uint8Tool.concat(epub.boxEncrypted.publicKey, epub.signEncrypted.publicKey), elt.signKey),
                                sharingGroup: elt.sharingGroup.map(function (pk) {
                                    var newPk = newBoxPublicKeys.get(pk.login);
                                    pk = newPk != null ? newPk : pk;
                                    var _a = encryption.encryptKey(kind, _this.session.encryption, pk.box), message = _a.message, nonce = _a.nonce;
                                    return {
                                        login: pk.login,
                                        version: pk.version,
                                        encryptedKey: message, nonce: nonce,
                                        kind: kind
                                    };
                                }),
                                backward: backward
                            };
                        });
                        return [4 /*yield*/, this.session.doProtoRequest({
                                method: "POST", code: 201,
                                path: "/api/v4/identity/" + encodeURIComponent(login) + "/sharingGraph",
                                request: function () { return proto_1.types.IdentityPostSharingGraphRequest.encode({
                                    graph: encryptedGraph,
                                }).finish(); }
                            })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    IdentityImpl.prototype.getSharingGraph = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var graph, ciphers, resolvedCiphers, resolvedGraph, key, boxKeys, firstSharingKey, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.doProtoRequest({
                            method: "GET", code: 200,
                            path: "/api/v4/identity/" + encodeURIComponent(login) + "/sharingGraph",
                            assume: { login: login, kind: DataPeps_1.IdentityAccessKind.WRITE },
                            response: proto_1.types.IdentityGetSharingGraphResponse.decode,
                        })
                        // Resolve ciphers in graph
                    ];
                    case 1:
                        graph = (_a.sent()).graph;
                        ciphers = [];
                        graph.forEach(function (elt, i) {
                            if (i != 0) {
                                ciphers.push(graph[i].sharingKey);
                            }
                            ciphers.push(graph[i].signKey);
                            ciphers.push(graph[i].boxKey);
                        });
                        return [4 /*yield*/, this.session.resolveCipherList(ciphers)];
                    case 2:
                        resolvedCiphers = _a.sent();
                        resolvedGraph = graph.map(function (elt, i) {
                            var sharingKey = i == 0 ? null : resolvedCiphers.shift();
                            var signKey = resolvedCiphers.shift();
                            var boxKey = resolvedCiphers.shift();
                            return __assign({}, elt, { sharingKey: sharingKey, signKey: signKey, boxKey: boxKey });
                        });
                        return [4 /*yield*/, this.session.getAssumeParams({ login: login, kind: DataPeps_1.IdentityAccessKind.WRITE })];
                    case 3:
                        key = (_a.sent()).key;
                        boxKeys = {};
                        return [4 /*yield*/, this.session.getAssumeParams({ login: login, kind: DataPeps_1.IdentityAccessKind.WRITE })];
                    case 4:
                        firstSharingKey = (_a.sent()).key.sharingKey;
                        x = resolvedGraph.map(function (elt, i) {
                            var sharingKey;
                            if (i == 0) {
                                sharingKey = firstSharingKey;
                            }
                            else {
                                var boxkey = boxKeys[elt.sharedFrom.login + elt.sharedFrom.version];
                                sharingKey = _this.session.encryption.decrypt(proto_1.types.ResourceType.SES, boxkey).decrypt(elt.sharingKey);
                            }
                            var boxKey = _this.session.encryption.decrypt(proto_1.types.ResourceType.SES, sharingKey).decrypt(elt.boxKey);
                            var signKey = _this.session.encryption.decrypt(proto_1.types.ResourceType.SES, sharingKey).decrypt(elt.signKey);
                            boxKeys[elt.login + elt.version] = boxKey;
                            return __assign({}, elt, { sharingKey: sharingKey, boxKey: boxKey, signKey: signKey });
                        });
                        return [2 /*return*/, x];
                }
            });
        });
    };
    return IdentityImpl;
}());
exports.IdentityImpl = IdentityImpl;
var IdentityX = /** @class */ (function () {
    function IdentityX() {
    }
    IdentityX.fromTypes = function (t) {
        var x = proto_1.types.Identity.create(t);
        return __assign({}, x, { created: new Date(t.created * 1000) });
    };
    IdentityX.toTypes = function (i) {
        return __assign({}, i, { created: null });
    };
    return IdentityX;
}());
exports.IdentityX = IdentityX;
//# sourceMappingURL=Identity.js.map