package ee.meeskond7.kultuuriranits_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class KultuuriranitsApplication {

	public static void main(String[] args) {
		SpringApplication.run(KultuuriranitsApplication.class, args);
	}

}
