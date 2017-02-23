// @flow

export type HttpResponse = {
    headers: Object,
    body: string,
    statusCode: number,
};

export type HttpRequest = {
    query: Object,
    body: Object,
    headers: Object,
    params: Object,
    httpMethod: string,
    path: string,
}

export type HttpEventInput = {
    resource: string,
    path: string,
    httpMethod: string,
    headers: Object,
    queryStringParameters: Object,
    pathParameters: Object,
    body: string,
}

export const parseRequest = (input: HttpEventInput): HttpRequest => ({
    query: input.queryStringParameters || {},
    body: JSON.parse(input.body || '{}'),
    headers: input.headers || {},
    params: input.pathParameters || {},
    path: input.path,
    httpMethod: input.httpMethod,
});

export const createResponse = (
    body: Object,
    statusCode: number,
    headers: Object = {}
): HttpResponse => ({
    headers: Object.assign({
        'Content-Type': 'application/json',
    }, headers),
    body: typeof body === 'string' ? body : JSON.stringify(body),
    statusCode,
});
