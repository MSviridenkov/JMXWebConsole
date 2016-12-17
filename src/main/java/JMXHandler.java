import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;

class JMXHandler implements HttpHandler {
    private String contentType;
    private String resource;

    JMXHandler(String contentType, String resource) {
        this.contentType = contentType;
        this.resource = resource;
    }

    public void handle(HttpExchange t) throws IOException {
        Headers h = t.getResponseHeaders();
        h.set("Content-Type", contentType);
        t.sendResponseHeaders(200, 0);
        OutputStreamWriter os = new OutputStreamWriter(t.getResponseBody(), "UTF-8");
        BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(resource)));
        StringBuilder sb = new StringBuilder("");

        String str;
        while((str = in.readLine()) != null) {
            sb.append(str);
            sb.append('\n');
        }

        os.write(sb.toString());
        os.close();
    }
}