/**
 *  Ping request for demo.moneta.ru
 *
 *  Run in docker:
 *
 * docker run --rm --mount type=bind,source=/home/username/src,target=/local/src \
 *   eclipse-temurin:11 java /local/src/ProxyTest4Moneta.java
 *
 *  @author Paul Ziebert
 */
package lab51.trial.proxy_connect;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.Locale;
import java.util.logging.Logger;

public class ProxyTest4Moneta {

    private static final Logger LOG =
        Logger.getLogger(ProxyTest4Moneta.class.getName());

    private static String serviceUri = "https://demo.moneta.ru/services";
    private static Map<String, String> proxyConfig = Map.of(
        "enabled", "true",
        "host", "192.168.0.1",
        "port", "3128",
        "user", "user",
        "secret", "secret"
    );

    private static String envelopeRequest =
"{ " + 
"    \"Envelope\": { " +
"        \"Header\": { " +
"            \"Security\": { " +
"                \"UsernameToken\": { " +
"                    \"Username\": \"moneta@nowhere.ru\", " +
"                    \"Password\": \"secret\" " +
"                } " +
"            } " +
"        }, " +
"        \"Body\": { " +
"            \"PingRequest\": { " +
"                \"any\": \"hello\" " +
"            } " +
"        } " +
"    } " +
"}";

    private static HttpClient createHttpClient(
        Map<String, String> config
    ) {
        var clientBuilder = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .followRedirects(HttpClient.Redirect.NORMAL)
            .connectTimeout(Duration.ofSeconds(30));
        if(Boolean.valueOf(config.get("enabled"))) {
            clientBuilder.proxy(ProxySelector.of(
                new InetSocketAddress(
                    config.get("host"),
                    Integer.valueOf(config.get("port"))
                )
            ));
        }
        return clientBuilder.build();
    }

    private static HttpRequest createHttpRequest(
        String uri,
        String envelope,
        Map<String, String> config
    ) {
        var requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(uri))
            .header("Content-type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(envelope));
        if(Boolean.valueOf(config.get("enabled"))) {
            String encoded = Base64.getEncoder()
                .encodeToString(
                    (config.get("user") + ":" + config.get("secret")).getBytes()
                );
            requestBuilder.header("Proxy-Authorization", "Basic " + encoded);
        }
        return requestBuilder.build();
    }

    /**
     *  @exception RuntimeException
     */
    public static void main(String[] args) {
        Locale.setDefault(Locale.ENGLISH);
        System.setProperty("jdk.http.auth.tunneling.disabledSchemes", "");
        System.setProperty(
            "java.util.logging.SimpleFormatter.format",
            "[%1$tF %1$tT] [%4$-7s] %5$s %n"
        );
        LOG.info("Ping request for " + serviceUri);
        final var client = createHttpClient(proxyConfig);
        final var request = createHttpRequest(
            serviceUri,
            envelopeRequest,
            proxyConfig
        );
        try {
            final var response =
                client.send(request, HttpResponse.BodyHandlers.ofString());
            LOG.info("Response: " + response.statusCode());
            response.headers().map().forEach((k, v) -> {
                LOG.fine(k.toString() + ":" + v.toString());
            });
            if(400 <= response.statusCode() && 499 >= response.statusCode()) {
                LOG.warning("service returned " + response.statusCode());
                throw new RuntimeException(response.body());
            }
            if(500 <= response.statusCode() && 599 >= response.statusCode()) {
                LOG.warning("service returned " + response.statusCode());
                throw new RuntimeException(response.body());
            }
            LOG.info(response.body());
            // return response.body();
        } catch(IOException e) {
            LOG.severe(e.getMessage());
            throw new RuntimeException(e.getMessage());
        } catch(InterruptedException e) {
            LOG.severe(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

}
