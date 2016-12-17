import com.sun.net.httpserver.HttpServer;
import org.jolokia.jvmagent.JolokiaServer;
import org.jolokia.jvmagent.JolokiaServerConfig;
import org.jolokia.jvmagent.JvmAgentConfig;

import java.net.InetSocketAddress;

public class JMXAgent {
    private int port;
    private HttpServer jolokiaHelpServer;
    private JolokiaServer jolokiaServer;

    public JMXAgent(int port) {
        try {
            this.port = port;
            this.jolokiaHelpServer = HttpServer.create(new InetSocketAddress("localhost", port), 10);

            this.jolokiaHelpServer.createContext("/", new JMXHandler("text/html", "index.html"));

            JolokiaServerConfig serverConfig = new JvmAgentConfig("host=localhost,port=8778");
            this.jolokiaServer = new JolokiaServer(this.jolokiaHelpServer, serverConfig, false);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void start() {
        this.jolokiaHelpServer.start();
        this.jolokiaServer.start();
        System.out.println("port = " + this.port);
        System.out.println("JMXAgent is running...");
    }

    public void stop() {
        this.jolokiaServer.stop();
        this.jolokiaHelpServer.stop(0);
        System.out.println("JMXAgent stopped.");
    }
}
