public class Main {
    private static final int DEFAULT_PORT = 8778;

    public static void main(String[] args) {
        if (args.length > 0) {
            new JMXAgent(Integer.parseInt(args[0])).start();
        } else {
            new JMXAgent(DEFAULT_PORT).start();
        }
    }
}